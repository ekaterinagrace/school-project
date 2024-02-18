# School Project

This is a web application for managing educational courses.

## Installation

To install the dependencies, run the following command:

```bash
npm install
```

## Dependencies

- body-parser: ^1.20.2
- express: ^4.18.2
- express-handlebars: ^7.1.2
- hbs: ^4.2.0
- mongoose: ^8.1.3
- nodemon: ^3.0.3

## Usage

To start the server, run the following command:

```bash
npm start
```

This will start the server using nodemon, which automatically restarts the server when changes are made to the files.

The application will be available at [http://localhost:80](http://localhost:80) by default.

## Features

- Display a list of courses
- Add new courses
- Delete existing courses

## File Structure

```
school-project/
│
├── public/
│   ├── css/
│   │   └── index.css
│   └── views/
│       └── index.hbs
│
├── node_modules/
│
├── index.js
├── package.json
└── README.md
```

## Contributing

Contributions are welcome! If you would like to contribute to this project, please open an issue or submit a pull request.

## License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
