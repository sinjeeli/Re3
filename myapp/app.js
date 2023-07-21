var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const indexRouter = require('./routes/index');
const booksRouter = require("./routes/books");


const sequelize = require("./models").sequelize;


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use("/books", booksRouter);

//Test connection to the database and sync the mode
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();







// 404 handler
app.use((req, res, next) => {
  const error = new Error('Page Not Found');
  error.status = 404;
  next(error);
});

// Global error handler
app.use((err, req, res, next) => {
  err.status = err.status || 500;
  err.message = err.message || 'Internal Server Error';

  // Log the error to the console
  console.error(`Error Status: ${err.status}, Message: ${err.message}`);

  // Render the appropriate error template
  if (err.status === 404) {
    res.status(404).render('page-not-found');
  } else {
    res.status(err.status).render('error', { err });
  }
});
//updates

module.exports = app;
