"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var jwt = require('jsonwebtoken');

var _require = require('uuidv4'),
    uuid = _require.uuid;

var pwdGenerator = require('generate-password');

var config = require('../config');

var authMailer = require('../components/mailer').auth;

var Errors = require('../utils/errors');

var Messages = require('../utils/messages');

var User = require('../models').User; // Constants


var EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var PASSWORD_REGEX = /^(?=.*\d).{4,16}$/; //min 4, max 8

exports.findUserByEmailMiddleware = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (req.body.email) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return", next(Errors.NotFoundError()));

          case 2:
            _context.prev = 2;
            _context.next = 5;
            return User.findByEmail(req.body.email);

          case 5:
            req.user = _context.sent;
            next();
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](2);
            return _context.abrupt("return", next(_context.t0));

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

exports.loginValidation = function (req, res, next) {
  var _req$body = req.body,
      email = _req$body.email,
      password = _req$body.password;

  if (!password) {
    return next(Errors.Error(Messages.errors.missing_password));
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return next(Errors.Error(Messages.errors.missing_or_invalid_email));
  }

  if (!PASSWORD_REGEX.test(password)) {
    return next(Errors.Error(Messages.errors.password_not_valid));
  } else {
    next();
  }
};

exports.ssoRegister = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var data, user, pwd, newUser;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            data = req.body;
            _context2.prev = 1;
            _context2.next = 4;
            return User.findByEmail(data.email);

          case 4:
            user = _context2.sent;

            if (user) {
              _context2.next = 13;
              break;
            }

            pwd = pwdGenerator.generate({
              length: 16
            });
            newUser = new User(_objectSpread(_objectSpread({}, data), {}, {
              sso: true,
              password: pwd,
              clear_password: pwd
            }));
            _context2.next = 10;
            return newUser.save();

          case 10:
            req.user = _context2.sent;
            _context2.next = 14;
            break;

          case 13:
            req.user = user;

          case 14:
            next();
            _context2.next = 20;
            break;

          case 17:
            _context2.prev = 17;
            _context2.t0 = _context2["catch"](1);
            return _context2.abrupt("return", next(_context2.t0));

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 17]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.loginAction = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var user, expirationTimeSeconds, token;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (req.user) {
              _context3.next = 2;
              break;
            }

            return _context3.abrupt("return", next(Errors.UnAuthorizedError(Messages.errors.user_not_found)));

          case 2:
            user = req.user;
            expirationTimeSeconds = Date.now() + 1000 * 60 * 60 * 24 * 10;
            token = jwt.sign({
              exp: Math.floor(expirationTimeSeconds / 1000),
              // 10days (seconds)
              uid: user._id
            }, config.jwt.encryption); // Adds a new cookie to the response

            return _context3.abrupt("return", res.cookie('token', token, {
              expires: new Date(expirationTimeSeconds),
              // 10days (milliseconds)
              httpOnly: true,
              // secure: !!config.isProd,
              sameSite: false
            }).json({
              success: true,
              data: user
            }));

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

exports.logoutAction = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            req.logout();
            return _context4.abrupt("return", res.cookie('token', null, {
              maxAge: 0,
              httpOnly: true
            }).json({
              success: true,
              data: 'logged out'
            }));

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();

exports.registerAction = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var _req$body2, email, password, user;

    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;

            if (password) {
              _context5.next = 3;
              break;
            }

            return _context5.abrupt("return", next(Errors.Error(Messages.errors.missing_password)));

          case 3:
            if (!(!email || !EMAIL_REGEX.test(email))) {
              _context5.next = 5;
              break;
            }

            return _context5.abrupt("return", next(Errors.Error(Messages.errors.missing_or_invalid_email)));

          case 5:
            if (PASSWORD_REGEX.test(password)) {
              _context5.next = 7;
              break;
            }

            return _context5.abrupt("return", next(Errors.Error(Messages.errors.password_not_valid)));

          case 7:
            user = new User(req.body);
            _context5.prev = 8;
            _context5.next = 11;
            return user.save();

          case 11:
            req.user = _context5.sent;
            next();
            _context5.next = 18;
            break;

          case 15:
            _context5.prev = 15;
            _context5.t0 = _context5["catch"](8);
            return _context5.abrupt("return", next(_context5.t0));

          case 18:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[8, 15]]);
  }));

  return function (_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}();

exports.registerProAction = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var _req$body3, email, password, user;

    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _req$body3 = req.body, email = _req$body3.email, password = _req$body3.password;

            if (password) {
              _context6.next = 3;
              break;
            }

            return _context6.abrupt("return", next(Errors.Error(Messages.errors.missing_password)));

          case 3:
            if (!(!email || !EMAIL_REGEX.test(email))) {
              _context6.next = 5;
              break;
            }

            return _context6.abrupt("return", next(Errors.Error(Messages.errors.missing_or_invalid_email)));

          case 5:
            if (PASSWORD_REGEX.test(password)) {
              _context6.next = 7;
              break;
            }

            return _context6.abrupt("return", next(Errors.Error(Messages.errors.password_not_valid)));

          case 7:
            user = new User(_objectSpread(_objectSpread({}, req.body), {}, {
              pro: true
            }));
            _context6.prev = 8;
            _context6.next = 11;
            return user.save();

          case 11:
            req.user = _context6.sent;
            next();
            _context6.next = 18;
            break;

          case 15:
            _context6.prev = 15;
            _context6.t0 = _context6["catch"](8);
            next(_context6.t0);

          case 18:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[8, 15]]);
  }));

  return function (_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}();

exports.confirmEmailTokenAction = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var token, decoded, updated;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            token = req.params.token;
            _context7.prev = 1;
            _context7.next = 4;
            return jwt.verify(token, config.jwt.encryption);

          case 4:
            decoded = _context7.sent;

            if (decoded.email) {
              _context7.next = 7;
              break;
            }

            return _context7.abrupt("return", next(Errors.UnAuthorizedError(Messages.errors.user_not_found)));

          case 7:
            _context7.next = 9;
            return User.confirmUserEmail(decoded.email);

          case 9:
            updated = _context7.sent;
            return _context7.abrupt("return", res.json({
              success: true,
              data: updated
            }));

          case 13:
            _context7.prev = 13;
            _context7.t0 = _context7["catch"](1);
            return _context7.abrupt("return", next(_context7.t0));

          case 16:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[1, 13]]);
  }));

  return function (_x19, _x20, _x21) {
    return _ref7.apply(this, arguments);
  };
}();

exports.sendEmailActivation = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    var token;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            if (req.user) {
              _context8.next = 2;
              break;
            }

            return _context8.abrupt("return", next(Errors.NotFoundError(Messages.errors.user_not_found)));

          case 2:
            token = jwt.sign({
              email: req.user.email
            }, config.jwt.encryption, {
              expiresIn: '1h'
            });
            _context8.next = 5;
            return authMailer.confirmAccount({
              firstname: req.user.firstname,
              lastname: req.user.lastname,
              email: req.user.email,
              link: token ? "".concat(config.frontend, "/auth/confirm-account?token=").concat(token) : null
            });

          case 5:
            return _context8.abrupt("return", res.json({
              success: true,
              data: {
                msg: Messages.success.user_successfully_registered
              }
            }));

          case 6:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function (_x22, _x23, _x24) {
    return _ref8.apply(this, arguments);
  };
}();

exports.authorizeAction = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res) {
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            return _context9.abrupt("return", res.json({
              success: true,
              data: req.user
            }));

          case 1:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function (_x25, _x26) {
    return _ref9.apply(this, arguments);
  };
}();

exports.forgotPasswordAction = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res, next) {
    var email, user, token, document, emailResult;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            email = req.body.email;
            _context10.prev = 1;
            _context10.next = 4;
            return User.findByEmail(email);

          case 4:
            user = _context10.sent;
            token = jwt.sign({
              email: user.email
            }, config.jwt.encryption, {
              expiresIn: '1h'
            });
            user.pass_reset = uuid();
            _context10.next = 9;
            return user.save();

          case 9:
            document = _context10.sent;
            _context10.next = 12;
            return authMailer.resetPassword({
              firstname: document.firstname,
              lastname: document.lastname,
              email: document.email,
              report_link: "".concat(config.frontend, "/auth/report"),
              reset_link: token ? "".concat(config.frontend, "/auth/reset-password?token=").concat(token) : null
            });

          case 12:
            emailResult = _context10.sent;
            return _context10.abrupt("return", res.json({
              success: true,
              data: emailResult
            }));

          case 16:
            _context10.prev = 16;
            _context10.t0 = _context10["catch"](1);
            next(_context10.t0);

          case 19:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[1, 16]]);
  }));

  return function (_x27, _x28, _x29) {
    return _ref10.apply(this, arguments);
  };
}();

exports.resetPasswordAction = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
    var _req$body4, token, password, decoded, email, updated;

    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _req$body4 = req.body, token = _req$body4.token, password = _req$body4.password;
            _context11.prev = 1;
            _context11.next = 4;
            return jwt.verify(token, config.jwt.encryption);

          case 4:
            decoded = _context11.sent;

            if (decoded) {
              _context11.next = 7;
              break;
            }

            return _context11.abrupt("return", next(Errors.NotFoundError(Messages.errors.user_not_found)));

          case 7:
            email = decoded.email;
            _context11.next = 10;
            return User.resetPassword(email, password);

          case 10:
            updated = _context11.sent;
            return _context11.abrupt("return", res.json({
              success: true,
              data: updated
            }));

          case 14:
            _context11.prev = 14;
            _context11.t0 = _context11["catch"](1);
            next(_context11.t0);

          case 17:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[1, 14]]);
  }));

  return function (_x30, _x31, _x32) {
    return _ref11.apply(this, arguments);
  };
}();