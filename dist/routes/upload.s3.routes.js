"use strict";

var express = require('express');

var app = express.Router();

var cors = require('cors');

var passportMiddleware = require('../middlewares/passport');

var corsMiddleware = require('../middlewares/cors.middleware');

var uploadController = require('../controllers/upload.s3.controller');

app.get('/config', corsMiddleware.manualCors, passportMiddleware.authenticate('cookie', {
  session: false
}), //TODO ADMIN
uploadController.getS3Config); //TODO remove
// GET URL

app.get('/generate-get-url', cors(), uploadController.generateGetUrl); //TODO remove
// PUT URL

app.get('/generate-put-url', cors(), uploadController.generatePutUrl);
module.exports = app;