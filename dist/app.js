"use strict";

var path = require('path');

var helmet = require('helmet');

var express = require('express');

var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');

var fileUpload = require('express-fileupload');

var config = require('./config');

var routes = require('./routes');

var app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
})); // eslint-disable-next-line no-undef

app.use(express["static"](path.join(__dirname, '../', 'public')));
app.set('trust proxy', 1); // trust first proxy
// enable files upload

app.use(fileUpload({
  createParentPath: true
})); //CRON JOBS

if (config.isProd) {
  require('./components/cron/announces/updateAfterTwoMonths');
}

app.use(function (req, res, next) {
  if (!req.headers.origin) {
    req.headers.origin = req.protocol + '://' + req.get('host');
  }

  next();
});
app.get('/', function (req, res) {
  return res.end('api live');
});
app.use(config.api_path, routes);
app.get('*', function (req, res, next) {
  return res.status(404).end('Page Not Found');
});
app.use(function (err, req, res, next) {
  var isError = err instanceof Error;
  var code = err.code || err.statusCode || 200;
  var error = {
    code: code,
    name: err.name || 'Error',
    message: isError ? err === null || err === void 0 ? void 0 : err.message : err
  };
  return res.json({
    success: false,
    error: error,
    isError: isError
  });
});
module.exports = app;