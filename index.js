const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const hbs = require('hbs');

const app = express();

app.use(express.static(`public`));
app.set('views', 'public/views');

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

// Подключение Handlebars в качестве шаблонизатора
app.set('view engine', 'hbs');

// Middleware для обработки тела запроса
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Маршрут для главной страницы
app.get('/', async (req, res) => {
  try {
    // Запрос курса из базы данных (в реальном приложении это будет запрос к базе данных)
    const courses = await Course.find({});
    
    if (courses.length > 0) {
      console.log('[INFO] -- courses.length > 0');
      res.render('index', { title: 'Главная страница', courses: courses });
    } else {
      console.log('[INFO] -- courses.length <= 0');
      res.render('index', { title: 'Главная страница', noCourses: true });
    }
  } catch (error) {
    console.error('[ERROR] -- Ошибка при получении курсов из базы данных:', error);
    res.status(500).send('Ошибка сервера');
  }
});

// Начало прослушивания сервера
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`[INFO] -- Сервер запущен на порту ${PORT}`);
});
