var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs')
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

global.appRoot = path.resolve(__dirname);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger(function (tokens, req, res) {
  let resTime = (tokens['response-time'](req, res)).split('.')[0];
  if(resTime.length < 2) resTime = '0'+resTime;
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res) == 500 ? 200 : tokens.status(req, res),
    resTime+'ms'
  ].join(' ')
}, { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
