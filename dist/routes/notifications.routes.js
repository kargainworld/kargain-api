"use strict";

var cors = require('cors');

var router = require('express').Router();

var passportMiddleware = require('../middlewares/passport');

var corsMiddleware = require('../middlewares/cors.middleware');

var notificationsController = require('../controllers/notifications.controller');

router.get('/');
router.get('/', passportMiddleware.authenticate('cookie', {
  session: false
}), notificationsController.getCurrentUserNotifications);
module.exports = router;