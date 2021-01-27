"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var cron = require('node-cron');

var moment = require('moment');

var config = require('../../../config');

var AnnounceMailer = require('../../../components/mailer').announces;

var AnnounceModel = require('../../../models').Announce;

cron.schedule('* * * * *', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
  var twoMonthsAgo, docs, emailsResults;
  return _regenerator["default"].wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          twoMonthsAgo = moment().subtract(2, 'months');
          _context3.prev = 1;
          _context3.next = 4;
          return AnnounceModel.find({
            visible: true,
            'createdAt': {
              $lt: twoMonthsAgo.toDate()
            }
          }).populate('user');

        case 4:
          docs = _context3.sent;
          _context3.next = 7;
          return Promise.all(docs.map( /*#__PURE__*/function () {
            var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(doc) {
              return _regenerator["default"].wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      doc.visible = false;
                      _context.next = 3;
                      return doc.save();

                    case 3:
                      return _context.abrupt("return", doc);

                    case 4:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee);
            }));

            return function (_x) {
              return _ref2.apply(this, arguments);
            };
          }()));

        case 7:
          _context3.next = 9;
          return Promise.all(docs.map( /*#__PURE__*/function () {
            var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(doc) {
              var _doc$user;

              return _regenerator["default"].wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      _context2.next = 2;
                      return AnnounceMailer.informDisabledAnnounce({
                        email: doc === null || doc === void 0 ? void 0 : (_doc$user = doc.user) === null || _doc$user === void 0 ? void 0 : _doc$user.email,
                        announce_title: doc.title,
                        announce_link: "".concat(config.frontend, "/announces/").concat(doc.slug),
                        announce_creation_date: moment(doc.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a')
                      });

                    case 2:
                      return _context2.abrupt("return", _context2.sent);

                    case 3:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, _callee2);
            }));

            return function (_x2) {
              return _ref3.apply(this, arguments);
            };
          }()));

        case 9:
          emailsResults = _context3.sent;
          _context3.next = 16;
          break;

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](1);
          console.log(_context3.t0);
          throw _context3.t0;

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, _callee3, null, [[1, 12]]);
})));