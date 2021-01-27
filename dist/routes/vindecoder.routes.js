"use strict";

var express = require('express');

var routes = express.Router();

var vinDecoderController = require('../controllers/vindecoder.controller');

routes.get('/decodefree/:vin', vinDecoderController.decodeFree);
routes.get('/decode/:vin', vinDecoderController.decode);
routes.get('/image/:vin', vinDecoderController.image);
module.exports = routes;