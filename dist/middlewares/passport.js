"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;

var JwtStrategy = require('passport-jwt').Strategy;

var ExtractJwt = require('passport-jwt').ExtractJwt;

var CookieStrategy = require('passport-cookie').Strategy;

var jwt = require('jsonwebtoken');

var config = require('../config');

var User = require('../models').User;

var Errors = require('../utils/errors');

passport.serializeUser(function (user, done) {
  return done(null, user.id);
});
passport.deserializeUser( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(id, done) {
    var user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return User.findById(id, '-password');

          case 3:
            user = _context.sent;

            if (!(user && !(user === null || user === void 0 ? void 0 : user.removed) === true)) {
              _context.next = 8;
              break;
            }

            return _context.abrupt("return", done(null, user));

          case 8:
            throw 'missing user';

          case 9:
            _context.next = 14;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](0);
            done(_context.t0);

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 11]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
passport.use(new LocalStrategy({
  passReqToCallback: true,
  usernameField: 'email',
  passwordField: 'password'
}, /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, email, password, done) {
    var user;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return User.findByEmail(email);

          case 3:
            user = _context2.sent;
            _context2.t0 = (user === null || user === void 0 ? void 0 : user.removed) === true || !user;

            if (_context2.t0) {
              _context2.next = 9;
              break;
            }

            _context2.next = 8;
            return user.comparePassword(password);

          case 8:
            _context2.t0 = !_context2.sent;

          case 9:
            if (!_context2.t0) {
              _context2.next = 11;
              break;
            }

            return _context2.abrupt("return", done(Errors.UnAuthorizedError('unknown user or invalid password')));

          case 11:
            return _context2.abrupt("return", done(null, user));

          case 14:
            _context2.prev = 14;
            _context2.t1 = _context2["catch"](0);
            return _context2.abrupt("return", done(_context2.t1));

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 14]]);
  }));

  return function (_x3, _x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}())); // Setting up JWT login strategy

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.encryption
}, function (jwtPayload, done) {
  if (jwtPayload.uid) {
    User.findOne({
      _id: jwtPayload.uid
    }, function (err, user) {
      if (err) {
        return done(err);
      }

      if (!user || (user === null || user === void 0 ? void 0 : user.removed) === true) {
        return done('missing user');
      }

      return done(null, user);
    });
  } else {
    return done(null, 'invalid user');
  }
})); // Setting up Cookie based login strategy

passport.use(new CookieStrategy( /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(token, done) {
    var decoded, user;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return jwt.verify(token, config.jwt.encryption);

          case 3:
            decoded = _context3.sent;

            if (!(!decoded || !decoded.uid)) {
              _context3.next = 6;
              break;
            }

            return _context3.abrupt("return", done('invalid token'));

          case 6:
            _context3.next = 8;
            return User.findById(decoded.uid);

          case 8:
            user = _context3.sent;

            if (!(!user || (user === null || user === void 0 ? void 0 : user.removed) === true)) {
              _context3.next = 13;
              break;
            }

            return _context3.abrupt("return", done('unknown user, try again'));

          case 13:
            return _context3.abrupt("return", done(null, user));

          case 14:
            _context3.next = 19;
            break;

          case 16:
            _context3.prev = 16;
            _context3.t0 = _context3["catch"](0);
            return _context3.abrupt("return", done(_context3.t0));

          case 19:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 16]]);
  }));

  return function (_x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}()));
module.exports = passport;