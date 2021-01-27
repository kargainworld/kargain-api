"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var Errors = require('../utils/errors');

var Messages = require('../utils/messages');

var notificationModel = require('../models').Notification;

exports.getCurrentUserNotifications = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var notifications;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (req.user) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return", next(Errors.UnAuthorizedError(Messages.errors.user_not_found)));

          case 2:
            _context.prev = 2;
            _context.next = 5;
            return notificationModel.findOne({
              to: req.user.id
            });

          case 5:
            notifications = _context.sent;
            return _context.abrupt("return", res.json({
              success: true,
              data: notifications
            }));

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](2);
            next(_context.t0);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 9]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();