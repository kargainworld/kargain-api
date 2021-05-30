"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var express = require('express');

var router = express.Router();

var config = require('../config');

var logger = require('../services/logger');

var authRoutes = require('./auth.routes');

var usersRoutes = require('./users.routes');

var announcesRoutes = require('./announce.routes');

var vehiclesRoutes = require('./vehicles.routes');

var vinDecoderRoutes = require('./vindecoder.routes');

var uploadS3Routes = require('./upload.s3.routes');

var commentsRoutes = require('./comments.routes');

var paymentsRoutes = require('./payments.routes');

var conversationsRoutes = require('./conversations.routes');

var searchRoutes = require('./search.routes');

var notificationsRoutes = require('./notifications.routes');

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/announces', announcesRoutes);
router.use('/vehicles', vehiclesRoutes);
router.use('/vindecoder', vinDecoderRoutes);
router.use('/uploads', uploadS3Routes);
router.use('/comments', commentsRoutes);
router.use('/payments', paymentsRoutes);
router.use('/conversations', conversationsRoutes);
router.use('/search', searchRoutes);
router.use('/notifications', notificationsRoutes);
router.get('/', function (req, res, next) {
  return res.end('api routes home');
});

if (!config.isProd) {
  router.get('/db', function (req, res, next) {
    return res.end(config.db.mongo_location);
  });
  router.get('/log', /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
      var date, log;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              date = new Date();
              log = {
                level: 'debug',
                time: date.getTime(),
                host: req.get('host')
              };
              _context.next = 4;
              return logger.debug(log);

            case 4:
              return _context.abrupt("return", res.json(log));

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());
  router.get('/config', function (req, res, next) {
    return res.json({
      success: true,
      data: {
        config: config
      }
    });
  });
}

module.exports = router;