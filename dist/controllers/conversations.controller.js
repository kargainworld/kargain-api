"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var Errors = require('../utils/errors');

var Messages = require('../utils/messages');

var ConversationModel = require('../models').Conversation;

exports.getCurrentUserConversations = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var conversations;
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
            return ConversationModel.find({
              $or: [{
                from: req.user.id
              }, {
                to: req.user.id
              }]
            }).populate({
              path: 'from',
              select: 'avatarUrl firstname username lastname email'
            }).populate({
              path: 'to',
              select: 'avatarUrl firstname username lastname email'
            });

          case 5:
            conversations = _context.sent;
            return _context.abrupt("return", res.json({
              success: true,
              data: conversations
            }));

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

exports.getConversationsWithProfile = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var profileId, conversation;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (req.user) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt("return", next(Errors.UnAuthorizedError(Messages.errors.user_not_found)));

          case 2:
            profileId = req.params.profileId;
            _context2.prev = 3;
            _context2.next = 6;
            return ConversationModel.findOne({
              $or: [{
                from: req.user.id,
                to: profileId
              }, {
                from: profileId,
                to: req.user.id
              }]
            }).populate({
              path: 'from',
              select: 'avatarUrl firstname username lastname email'
            }).populate({
              path: 'to',
              select: 'avatarUrl firstname username lastname email'
            });

          case 6:
            conversation = _context2.sent;
            return _context2.abrupt("return", res.json({
              success: true,
              data: conversation
            }));

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](3);
            return _context2.abrupt("return", next(_context2.t0));

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[3, 10]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.postConversationMessage = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var _req$body, message, recipientId, conversation;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _req$body = req.body, message = _req$body.message, recipientId = _req$body.recipientId;

            if (req.user) {
              _context3.next = 3;
              break;
            }

            return _context3.abrupt("return", next(Errors.UnAuthorizedError(Messages.errors.user_not_found)));

          case 3:
            if (recipientId) {
              _context3.next = 5;
              break;
            }

            return _context3.abrupt("return", next(Errors.UnAuthorizedError(Messages.errors.user_not_found)));

          case 5:
            _context3.prev = 5;
            _context3.next = 8;
            return ConversationModel.findOneAndUpdate({
              $or: [{
                from: req.user.id,
                to: recipientId
              }, {
                from: recipientId,
                to: req.user.id
              }]
            }, {
              from: req.user.id,
              to: recipientId,
              $push: {
                messages: {
                  from: req.user.id,
                  content: message,
                  createdAt: new Date(),
                  updatedAt: new Date()
                }
              }
            }, {
              "new": true,
              upsert: true
            }).populate({
              path: 'from',
              select: 'avatarUrl firstname username lastname email'
            }).populate({
              path: 'to',
              select: 'avatarUrl firstname username lastname email'
            });

          case 8:
            conversation = _context3.sent;
            return _context3.abrupt("return", res.json({
              success: true,
              data: conversation
            }));

          case 12:
            _context3.prev = 12;
            _context3.t0 = _context3["catch"](5);
            return _context3.abrupt("return", next(_context3.t0));

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[5, 12]]);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();