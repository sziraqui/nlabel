var createError = require('http-errors');
var express = require('express');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileUploader = require('express-fileupload');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var galleryRouter = require('./routes/gallery');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars.engine);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUploader());
app.use('/', indexRouter);
app.use('/gallery', galleryRouter);

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
