"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var CONFIG = require('../../../config');

var mailer = require('../../../services/mailer');

var successConfirmAnnounce = /*#__PURE__*/function () {
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
            if (params.firstname) {
              _context.next = 4;
              break;
            }

            throw new Error('missing firstname');

          case 4:
            if (params.title) {
              _context.next = 6;
              break;
            }

            throw new Error('missing title');

          case 6:
            if (params.announce_link) {
              _context.next = 8;
              break;
            }

            throw new Error('missing announce link');

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
                Variables: {
                  title: params.title,
                  announce_link: params.announce_link,
                  featured_img_link: params.featured_img_link
                },
                TemplateID: 1481702,
                TemplateLanguage: true,
                Subject: 'Kargain | Announce activated'
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

  return function successConfirmAnnounce(_x) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = successConfirmAnnounce;