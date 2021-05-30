"use strict";

var router = require('express').Router();

var cors = require('cors');

var corsMiddleware = require('../middlewares/cors.middleware');

var rolesMiddleware = require('../middlewares/roles.middleware');

var passportMiddleware = require('../middlewares/passport');

var authMiddleware = require('../middlewares/auth.middleware');

var usersController = require('../controllers/users.controller');

var uploadController = require('../controllers/upload.s3.controller'); //admin


router.get('/all', corsMiddleware.manualCors, passportMiddleware.authenticate('cookie', {
  session: false
}), rolesMiddleware.grantAccess('readAny', 'profile'), usersController.getUsersAdminAction);
router.get('/username/:username', corsMiddleware.manualCors, authMiddleware.byPassAuth(), usersController.getUserByUsername);
router.options('/save', cors(corsMiddleware.authedCors)); // enable pre-flights

router.put('/save', corsMiddleware.manualCors, passportMiddleware.authenticate('cookie', {
  session: false
}), rolesMiddleware.grantAccess('updateOwn', 'profile'), usersController.saveAuthedUser);
router.options('/save/username/:username', cors(corsMiddleware.authedCors)); // enable pre-flights

router.put('/save/username/:username', corsMiddleware.manualCors, passportMiddleware.authenticate('cookie', {
  session: false
}), //TODO restrict admin privilege
rolesMiddleware.grantAccess('updateOwn', 'profile'), usersController.saveUserByUsername);
router.options('/update', cors(corsMiddleware.authedCors)); // enable pre-flights

router.put('/update', corsMiddleware.manualCors, passportMiddleware.authenticate('cookie', {
  session: false
}), rolesMiddleware.grantAccess('updateOwn', 'profile'), usersController.updateUser);
router.options('/update-admin/:username', cors(corsMiddleware.authedCors)); // enable pre-flights

router.put('/update-admin/:username', corsMiddleware.manualCors, passportMiddleware.authenticate('cookie', {
  session: false
}), rolesMiddleware.grantAccess('updateAny', 'profile'), usersController.updateAdminUser);
router.options('/upload/avatar', cors(corsMiddleware.authedCors)); // enable pre-flights

router.post('/upload/avatar', corsMiddleware.manualCors, passportMiddleware.authenticate('cookie', {
  session: false
}), uploadController.postObjects, usersController.uploadAvatar);
router.options('/follow/:user_id', cors(corsMiddleware.authedCors)); // enable pre-flights

router.post('/follow/:user_id', corsMiddleware.manualCors, passportMiddleware.authenticate('cookie', {
  session: false
}), usersController.followUserAction);
router.options('/unfollow/:user_id', cors(corsMiddleware.authedCors)); // enable pre-flights

router.post('/unfollow/:user_id', corsMiddleware.manualCors, passportMiddleware.authenticate('cookie', {
  session: false
}), usersController.unFollowUserAction);
router.options('/newsletter', cors(corsMiddleware.clientCors)); // enable pre-flights

router.put('/newsletter', cors(corsMiddleware.clientCors), usersController.subscribeNewsletter);
router.options('/contact', cors(corsMiddleware.clientCors)); // enable pre-flights

router.post('/contact', cors(corsMiddleware.clientCors), usersController.contact);
router["delete"]('/:username', corsMiddleware.manualCors, passportMiddleware.authenticate('cookie', {
  session: false
}), rolesMiddleware.grantAccess('deleteAny', 'profile'), usersController.deleteUser);
module.exports = router;