"use strict";

var config = require('../config');

var Errors = require('../utils/errors');

var logger = require('../services/logger');

function corsOptions() {
  var allowCredentials = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  return {
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    preflightContinue: true,
    credentials: true,
    origin: function origin(_origin, callback) {
      if (config.whileListDomains.indexOf(_origin) !== -1) {
        callback(null, allowCredentials ? _origin : true);
      } else {
        callback(Errors.UnAuthorizedError('Not allowed by CORS'));
      }
    }
  };
}

var manualCors = function manualCors(req, res, next) {
  var origin = req.headers.origin;

  if (config.whileListDomains.indexOf(origin) !== -1) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', true);
  }

  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
};

var clientCors = corsOptions(false);
var authedCors = corsOptions(true);
module.exports = {
  clientCors: clientCors,
  authedCors: authedCors,
  manualCors: manualCors
};