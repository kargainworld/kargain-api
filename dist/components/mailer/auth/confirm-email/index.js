"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var CONFIG = require('../../../../config');

var mailer = require('../../../../services/mailer');

var sendConfirmEmail = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(params) {
    var message;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (params.email) {
              _context.next = 2;
              break;
            }

            throw new Error('missing email');

          case 2:
            if (params.lastname) {
              _context.next = 4;
              break;
            }

            throw new Error('missing lastname');

          case 4:
            if (params.firstname) {
              _context.next = 6;
              break;
            }

            throw new Error('missing firstname');

          case 6:
            if (params.link) {
              _context.next = 8;
              break;
            }

            throw new Error('missing activation link');

          case 8:
            message = {
              Messages: [{
                From: {
                  Email: CONFIG.mailer.from.email,
                  Name: CONFIG.mailer.from.name
                },
                To: [{
                  Email: params.email,
                  Name: "".concat(params.lastname, " ").concat(params.firstname)
                }],
                TemplateID: 1336296,
                TemplateLanguage: true,
                Subject: 'Email confirmation Kargain',
                Variables: {
                  activation_link: params.link
                }
              }]
            };
            _context.next = 11;
            return mailer.sendMailJet(message);

          case 11:
            return _context.abrupt("return", _context.sent);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function sendConfirmEmail(_x) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = sendConfirmEmail;