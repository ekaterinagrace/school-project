const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.static(`public`));
app.set('views', 'public/views');

// Подключение Handlebars в качестве шаблонизатора
app.set('view engine', 'hbs');

// Middleware для обработки JSON в теле запроса
app.use(express.json());

// Middleware для обработки тела запроса
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware для работы с cookies
app.use(cookieParser());


// Подключение к MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/school-project')
  .then(() => {
    console.log('[INFO] -- Успешное подключение к базе данных');
  })
  .catch((error) => {
    console.error('[ERROR] -- Ошибка подключения к базе данных:', error);
  });

// Определение модели курса (в реальном приложении это будет импорт из файла с моделями)
const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String
});

// Модель пользователя
const User = mongoose.model('User', {
  username: String,
  email: { type: String, unique: true },
  password: String,
});

const Course = mongoose.model('Course', CourseSchema);

// Создание курса (в реальном приложении это будет добавление курса в базу данных)
const course = new Course({
  name: 'Программирование на Node.js',
  description: 'Изучение разработки веб-приложений на Node.js'
});

// Сохранение курса в базе данных
course.save()
  .then(() => {
    console.log('[INFO] -- Курс успешно создан и сохранен в базе данных');
  })
  .catch((error) => {
    if (error.code === 11000) {
      console.error('[WARNING] -- Ошибка при создании и сохранении курса в базе данных: Курс с таким именем уже существует');
    } else {
      console.error('[ERROR] -- Ошибка при создании и сохранении курса в базе данных:', error);
    }
});



// Маршрут для главной страницы
app.get('/', async (req, res) => {
  try {
    // Проверка аутентификации пользователя
    const userId = req.cookies.userId;
    if (!userId) {
      return res.redirect('/login');
    }

    // Получение информации о текущем пользователе из базы данных
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('Пользователь не найден');
    }
    
    // Запрос курсов из базы данных
    const courses = await Course.find({});
    
    if (courses.length > 0) {
      res.render('index', { title: 'Главная страница', user: user, courses: courses });
    } else {
      res.render('index', { title: 'Главная страница', user: user, noCourses: true });
    }
  } catch (error) {
    console.error('[ERROR] -- Ошибка при получении данных:', error);
    res.status(500).send('Ошибка сервера');
  }
});

// Маршрут для аутентификации
app.get('/login',  (req, res) => {
  res.render('login.hbs');
});

// Маршрут для регистрации
app.get('/register',  (req, res) => {
  res.render('register.hbs');
});

// Маршрут для перехода к профилю
app.get('/profile',  (req, res) => {
  res.render('profile.hbs');
});

// Регистрация пользователя
app.post('/reg', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).redirect(`/login`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка сервера');
  }
});

// Аутентификация пользователя
app.post('/auth', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send('Пользователь не найден');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send('Неверный пароль');
    }
    
    // Устанавливаем cookie после успешной аутентификации
    res.cookie('userId', user._id, { httpOnly: true });
    
    res.status(200).redirect(`/`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка сервера');
  }
});

// Маршрут для выхода из профиля
app.get('/logout', (req, res) => {
  // Удаление cookies
  res.clearCookie('userId');
  // Перенаправление на страницу аутентификации
  res.redirect('/login');
});

// Начало прослушивания сервера
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`[INFO] -- Сервер запущен на порту ${PORT}`);
});
