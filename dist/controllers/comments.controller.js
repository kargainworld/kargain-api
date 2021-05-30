"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var AnnounceModel = require('../models').Announce;

var CommentModel = require('../models').Comment;

var Errors = require('../utils/errors');

var Messages = require('../utils/messages');

exports.getCommentsByAnnounce = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var announce_id, announce, comments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            announce_id = req.params.announce_id;
            _context.next = 3;
            return AnnounceModel.findById(announce_id).exec();

          case 3:
            announce = _context.sent;

            if (announce) {
              _context.next = 6;
              break;
            }

            throw Errors.NotFoundError(Messages.errors.announce_not_found);

          case 6:
            _context.next = 8;
            return CommentModel.find({
              announce: announce_id,
              enabled: true
            }).exec();

          case 8:
            comments = _context.sent;
            return _context.abrupt("return", res.json({
              success: true,
              data: comments
            }));

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.getCommentsWithComplaints = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var comments;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return CommentModel.find({
              complaints: true
            }, function (err) {
              return console.error(err);
            }).exec();

          case 2:
            comments = _context2.sent;
            return _context2.abrupt("return", res.json({
              success: true,
              data: comments
            }));

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.createComment = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var _req$body, announce_id, message, announce, comment, doc;

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
            _req$body = req.body, announce_id = _req$body.announce_id, message = _req$body.message;
            _context3.next = 5;
            return AnnounceModel.findById(announce_id).exec();

          case 5:
            announce = _context3.sent;

            if (announce) {
              _context3.next = 8;
              break;
            }

            throw Errors.NotFoundError(Messages.errors.announce_not_found);

          case 8:
            if (message) {
              _context3.next = 10;
              break;
            }

            return _context3.abrupt("return", next(Messages.errors.comment_is_empty));

          case 10:
            _context3.prev = 10;
            comment = new CommentModel({
              announce: announce_id,
              user: req.user,
              message: message
            });
            _context3.next = 14;
            return comment.save();

          case 14:
            doc = _context3.sent;
            announce.comments.push(doc._id);
            _context3.next = 18;
            return announce.save();

          case 18:
            return _context3.abrupt("return", res.json({
              success: true,
              data: doc
            }));

          case 21:
            _context3.prev = 21;
            _context3.t0 = _context3["catch"](10);
            next(_context3.t0);

          case 24:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[10, 21]]);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

exports.enableComment = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var comment_id, update;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (req.user) {
              _context4.next = 2;
              break;
            }

            return _context4.abrupt("return", next(Errors.UnAuthorizedError(Messages.errors.user_not_found)));

          case 2:
            comment_id = req.params.comment_id;
            _context4.next = 5;
            return CommentModel.findOneAndUpdate({
              _id: comment_id
            }, {
              enabled: true
            }).exec();

          case 5:
            update = _context4.sent;
            return _context4.abrupt("return", res.json({
              success: true,
              data: update
            }));

          case 7:
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

exports.disableComment = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var comment_id, update;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (req.user) {
              _context5.next = 2;
              break;
            }

            return _context5.abrupt("return", next(Errors.UnAuthorizedError(Messages.errors.user_not_found)));

          case 2:
            comment_id = req.params.comment_id;
            _context5.next = 5;
            return CommentModel.findOneAndUpdate({
              _id: comment_id
            }, {
              enabled: false
            }).exec();

          case 5:
            update = _context5.sent;
            return _context5.abrupt("return", res.json({
              success: true,
              data: update
            }));

          case 7:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}();

exports.createCommentResponse = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var _req$body2, commentId, message, comment, CommentResponse, document, populatedComment;

    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            if (req.user) {
              _context6.next = 2;
              break;
            }

            return _context6.abrupt("return", next(Errors.UnAuthorizedError(Messages.errors.user_not_found)));

          case 2:
            _req$body2 = req.body, commentId = _req$body2.comment_id, message = _req$body2.message;
            _context6.next = 5;
            return CommentModel.findById(commentId).exec();

          case 5:
            comment = _context6.sent;

            if (comment) {
              _context6.next = 8;
              break;
            }

            return _context6.abrupt("return", next(Errors.NotFoundError(Messages.errors.comment_not_found)));

          case 8:
            if (message) {
              _context6.next = 10;
              break;
            }

            return _context6.abrupt("return", next(Errors.Error(Messages.errors.message_not_found)));

          case 10:
            _context6.prev = 10;
            CommentResponse = {
              user: req.user.id,
              message: message
            };

            if (!comment.responses) {
              comment.responses = [];
            }

            comment.responses.push(CommentResponse);
            _context6.next = 16;
            return comment.save();

          case 16:
            document = _context6.sent;
            _context6.next = 19;
            return document.populate('user').populate('responses.user').execPopulate();

          case 19:
            populatedComment = _context6.sent;
            return _context6.abrupt("return", res.json({
              success: true,
              data: populatedComment
            }));

          case 23:
            _context6.prev = 23;
            _context6.t0 = _context6["catch"](10);
            return _context6.abrupt("return", next(_context6.t0));

          case 26:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[10, 23]]);
  }));

  return function (_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}();

exports.removeComment = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var comment_id, document;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            if (req.user) {
              _context7.next = 2;
              break;
            }

            return _context7.abrupt("return", next(Errors.UnAuthorizedError(Messages.errors.user_not_found)));

          case 2:
            comment_id = req.params.comment_id;
            _context7.next = 5;
            return CommentModel.findOneAndDelete({
              _id: comment_id
            }).exec();

          case 5:
            document = _context7.sent;
            return _context7.abrupt("return", res.json({
              success: true,
              data: document
            }));

          case 7:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function (_x19, _x20, _x21) {
    return _ref7.apply(this, arguments);
  };
}();

exports.createCommentLike = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    var commentId, comment, document;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            if (req.user) {
              _context8.next = 2;
              break;
            }

            return _context8.abrupt("return", next(Errors.UnAuthorizedError(Messages.errors.user_not_found)));

          case 2:
            commentId = req.params.comment_id;
            _context8.next = 5;
            return CommentModel.findById(commentId).exec();

          case 5:
            comment = _context8.sent;

            if (comment) {
              _context8.next = 8;
              break;
            }

            return _context8.abrupt("return", next(Errors.NotFoundError(Messages.errors.comment_not_found)));

          case 8:
            if (!comment.likes) {
              comment.likes = [];
            }

            comment.likes.push({
              user: req.user.id
            });
            _context8.next = 12;
            return comment.save();

          case 12:
            document = _context8.sent;
            return _context8.abrupt("return", res.json({
              success: true,
              data: document
            }));

          case 14:
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

exports.removeCommentLike = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res, next) {
    var _req$params, commentId, likeIndex, comment, document;

    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            if (req.user) {
              _context9.next = 2;
              break;
            }

            return _context9.abrupt("return", next(Errors.UnAuthorizedError(Messages.errors.user_not_found)));

          case 2:
            _req$params = req.params, commentId = _req$params.comment_id, likeIndex = _req$params.likeIndex;
            _context9.next = 5;
            return CommentModel.findById(commentId).exec();

          case 5:
            comment = _context9.sent;

            if (comment) {
              _context9.next = 8;
              break;
            }

            return _context9.abrupt("return", next(Errors.NotFoundError(Messages.errors.comment_not_found)));

          case 8:
            comment.likes = comment.likes.slice(0, likeIndex).concat(comment.likes.slice(likeIndex + 1, comment.likes.length));
            _context9.next = 11;
            return comment.save();

          case 11:
            document = _context9.sent;
            return _context9.abrupt("return", res.json({
              success: true,
              data: document
            }));

          case 13:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function (_x25, _x26, _x27) {
    return _ref9.apply(this, arguments);
  };
}();

exports.createCommentResponseLike = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res, next) {
    var _req$params2, commentId, responseIndex, comment, response, document;

    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            if (req.user) {
              _context10.next = 2;
              break;
            }

            return _context10.abrupt("return", next(Errors.UnAuthorizedError(Messages.errors.user_not_found)));

          case 2:
            _req$params2 = req.params, commentId = _req$params2.comment_id, responseIndex = _req$params2.responseIndex;
            _context10.next = 5;
            return CommentModel.findById(commentId).exec();

          case 5:
            comment = _context10.sent;

            if (comment) {
              _context10.next = 8;
              break;
            }

            return _context10.abrupt("return", next(Errors.NotFoundError(Messages.errors.comment_not_found)));

          case 8:
            response = comment.responses && comment.responses[responseIndex];

            if (response) {
              _context10.next = 11;
              break;
            }

            return _context10.abrupt("return", next(Errors.NotFoundError(Messages.errors.response_not_found)));

          case 11:
            response.likes.push({
              user: req.user.id
            });
            _context10.next = 14;
            return comment.save();

          case 14:
            document = _context10.sent;
            return _context10.abrupt("return", res.json({
              success: true,
              data: document
            }));

          case 16:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function (_x28, _x29, _x30) {
    return _ref10.apply(this, arguments);
  };
}();

exports.removeCommentResponseLike = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
    var _req$params3, commentId, responseIndex, likeIndex, comment, response, document;

    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            if (req.user) {
              _context11.next = 2;
              break;
            }

            return _context11.abrupt("return", next(Errors.UnAuthorizedError(Messages.errors.user_not_found)));

          case 2:
            _req$params3 = req.params, commentId = _req$params3.comment_id, responseIndex = _req$params3.responseIndex, likeIndex = _req$params3.likeIndex;
            _context11.next = 5;
            return CommentModel.findById(commentId).exec();

          case 5:
            comment = _context11.sent;

            if (comment) {
              _context11.next = 8;
              break;
            }

            return _context11.abrupt("return", next(Errors.NotFoundError(Messages.errors.comment_not_found)));

          case 8:
            response = comment.responses && comment.responses[responseIndex];

            if (response) {
              _context11.next = 11;
              break;
            }

            return _context11.abrupt("return", next(Errors.NotFoundError(Messages.errors.response_not_found)));

          case 11:
            response.likes = response.likes.slice(0, likeIndex).concat(comment.likes.slice(likeIndex + 1, response.likes.length));
            _context11.next = 14;
            return comment.save();

          case 14:
            document = _context11.sent;
            return _context11.abrupt("return", res.json({
              success: true,
              data: document
            }));

          case 16:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function (_x31, _x32, _x33) {
    return _ref11.apply(this, arguments);
  };
}();

exports.addCommentComplaint = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res, next) {
    var _req$params4, commentId, responseIndex, likeIndex, comment, document;

    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            if (req.user) {
              _context12.next = 2;
              break;
            }

            return _context12.abrupt("return", next(Errors.UnAuthorizedError(Messages.errors.user_not_found)));

          case 2:
            _req$params4 = req.params, commentId = _req$params4.comment_id, responseIndex = _req$params4.responseIndex, likeIndex = _req$params4.likeIndex;
            _context12.next = 5;
            return CommentModel.findById(commentId).exec();

          case 5:
            comment = _context12.sent;

            if (comment) {
              _context12.next = 8;
              break;
            }

            return _context12.abrupt("return", next(Errors.NotFoundError(Messages.errors.comment_not_found)));

          case 8:
            comment.complaints = true;
            _context12.next = 11;
            return comment.save();

          case 11:
            document = _context12.sent;
            return _context12.abrupt("return", res.json({
              success: true,
              data: document
            }));

          case 13:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));

  return function (_x34, _x35, _x36) {
    return _ref12.apply(this, arguments);
  };
}();