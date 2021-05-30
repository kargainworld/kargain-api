"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var jwt = require('jsonwebtoken');

var Errors = require('../utils/errors');

var Messages = require('../utils/messages');

var config = require('../config');

var User = require('../models').User;

var byPassAuth = function byPassAuth() {
  var populates = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
      var _ref2, _req$signedCookies$to, _req$signedCookies, _req$cookies, token, decoded, request, user;

      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              token = (_ref2 = (_req$signedCookies$to = req === null || req === void 0 ? void 0 : (_req$signedCookies = req.signedCookies) === null || _req$signedCookies === void 0 ? void 0 : _req$signedCookies['token']) !== null && _req$signedCookies$to !== void 0 ? _req$signedCookies$to : req === null || req === void 0 ? void 0 : (_req$cookies = req.cookies) === null || _req$cookies === void 0 ? void 0 : _req$cookies['token']) !== null && _ref2 !== void 0 ? _ref2 : null;

              if (token) {
                _context.next = 4;
                break;
              }

              return _context.abrupt("return", next());

            case 4:
              _context.next = 6;
              return jwt.verify(token, config.jwt.encryption);

            case 6:
              decoded = _context.sent;

              if (!(!decoded || !decoded.uid)) {
                _context.next = 9;
                break;
              }

              return _context.abrupt("return", next(Errors.UnAuthorizedError(Messages.errors.user_not_found)));

            case 9:
              request = User.findById(decoded.uid);
              populates.forEach(function (populate) {
                request = request.populate(populate);
              });
              _context.next = 13;
              return request.exec();

            case 13:
              user = _context.sent;

              if (user && !(user === null || user === void 0 ? void 0 : user.removed) === true) {
                req.user = user;
              }

              next();
              _context.next = 21;
              break;

            case 18:
              _context.prev = 18;
              _context.t0 = _context["catch"](0);
              return _context.abrupt("return", next(_context.t0));

            case 21:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 18]]);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();
};

module.exports = {
  byPassAuth: byPassAuth
};