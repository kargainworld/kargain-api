"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var CONFIG = require('../../../config');

var mailer = require('../../../services/mailer');

var Errors = require('../../../utils/errors');

var Messages = require('../../../utils/messages');

var confirmCreateAnnounce = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(params) {
    var message;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (params.emailTo) {
              _context.next = 2;
              break;
            }

            throw Errors.NotFoundError(Messages.missing_or_invalid_email);

          case 2:
            if (params.announce_link) {
              _context.next = 4;
              break;
            }

            throw Errors.NotFoundError(Messages.announce_not_found);

          case 4:
            if (params.fromFullName) {
              _context.next = 6;
              break;
            }

            throw Errors.NotFoundError(Messages.announce_not_found);

          case 6:
            message = {
              Messages: [{
                From: {
                  Email: CONFIG.mailer.from.email,
                  Name: CONFIG.mailer.from.name
                },
                To: [{
                  Email: params.emailTo
                }],
                Variables: {
                  fromFullName: params.fromFullName,
                  announce_link: params.announce_link,
                  featured_img_link: params.featured_img_link
                },
                TemplateID: 1683826,
                TemplateLanguage: true,
                Subject: 'Kargain Share announce'
              }]
            };
            _context.next = 9;
            return mailer.sendMailJet(message);

          case 9:
            return _context.abrupt("return", _context.sent);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function confirmCreateAnnounce(_x) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = confirmCreateAnnounce;