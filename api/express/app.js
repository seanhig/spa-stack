var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexController = require('./controllers/index');
var usersController = require('./controllers/users');
var aboutController = require('./controllers/about');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/', express.static('../../.dist/app/browser'))
//app.use('/', indexController);
app.use('/api/users', usersController);
app.use('/api/about', aboutController);

module.exports = app;
