"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var nodemailer = require('nodemailer');

var mailjet = require('node-mailjet');

var CONFIG = require('../config');

var mailConfig = CONFIG.mailer.mailjet.smtp;
var transporter = nodemailer.createTransport(mailConfig);

var verify = function verify(callback) {
  transporter.verify(function (err, success) {
    if (err) {
      return callback(err);
    }

    callback(null, success);
  });
};

var test = function test(callback) {
  var recipient = {
    firstname: 'nicolas',
    lastname: 'giraudo',
    email: 'giraudo.nicolas13@gmail.com'
  };
  var message = {
    from: {
      name: CONFIG.mailer.from.name,
      address: CONFIG.mailer.from.email
    },
    to: {
      name: "".concat(recipient.lastname, " ").concat(recipient.lastname),
      address: recipient.email
    },
    subject: 'Message title',
    text: 'Plaintext version of the message'
  };
  nodemailer.createTestAccount(function (err) {
    if (err) {
      return callback(err);
    }

    transporter.sendMail(message).then(function (info) {
      console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
      callback(null, info);
    });
  });
};

var nodeMailerLegacy = function nodeMailerLegacy(message, callback) {
  transporter.sendMail(message, function (err, info) {
    console.log("Preview: ".concat(nodemailer.getTestMessageUrl(info)));
    callback(err, info);
  });
};

var sendMailJet = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(message) {
    var mailer;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            mailer = mailjet.connect(CONFIG.mailer.mailjet.API_KEY, CONFIG.mailer.mailjet.password);
            _context.next = 3;
            return mailer.post('send', {
              version: 'v3.1',
              timeout: 1000,
              perform_api_call: true // false to disable

            }).request(message);

          case 3:
            return _context.abrupt("return", _context.sent);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function sendMailJet(_x) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = {
  test: test,
  verify: verify,
  nodeMailerLegacy: nodeMailerLegacy,
  sendMailJet: sendMailJet
};