"use strict";

var express = require('express');

var cors = require('cors');

var routes = express.Router();

var passportMiddleware = require('../middlewares/passport');

var paymentController = require('../controllers/payments.controller');

var corsMiddleware = require('../middlewares/cors.middleware');

routes.get('/secret/:intent_id', corsMiddleware.manualCors, passportMiddleware.authenticate('cookie', {
  session: false
}), paymentController.getIntent);
routes.options('/create-payment-intent', cors(corsMiddleware.clientCors)); // enable pre-flights

routes.post('/create-payment-intent', cors(corsMiddleware.clientCors), passportMiddleware.authenticate('cookie', {
  session: false
}), paymentController.createPaymentIntent);
routes.options('/create-user-subscription', cors(corsMiddleware.authedCors)); // enable pre-flights

routes.post('/create-user-subscription', corsMiddleware.manualCors, passportMiddleware.authenticate('cookie', {
  session: false
}), paymentController.createUserSubscription);
module.exports = routes;