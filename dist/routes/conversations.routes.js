"use strict";

var express = require('express');

var cors = require('cors');

var routes = express.Router();

var passportMiddleware = require('../middlewares/passport');

var conversationController = require('../controllers/conversations.controller');

var corsMiddleware = require('../middlewares/cors.middleware');

routes.get('/', corsMiddleware.manualCors, passportMiddleware.authenticate('cookie', {
  session: false
}), conversationController.getCurrentUserConversations);
routes.get('/profile/:profileId', corsMiddleware.manualCors, passportMiddleware.authenticate('cookie', {
  session: false
}), conversationController.getConversationsWithProfile);
routes.options('/', cors(corsMiddleware.authedCors)); // enable pre-flights

routes.post('/', corsMiddleware.manualCors, passportMiddleware.authenticate('cookie', {
  session: false
}), conversationController.postConversationMessage);
module.exports = routes;