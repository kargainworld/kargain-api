"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var moment = require('moment');

var Errors = require('../utils/errors');

var Messages = require('../utils/messages');

var functions = require('../utils/helpers');

var UserModel = require('../models').User;

var AnnounceModel = require('../models').Announce;

var NewsletterSubscriber = require('../models').NewsletterSubscriber;

var ContactMessage = require('../models').ContactMessage;

var usersMailer = require('../components/mailer').users;

exports.getUsersAdminAction = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var page, size, sorters, skip, total, rows, data;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            page = req.query.page && parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
            size = 50;
            sorters = {
              createdAt: -1
            };

            if (req.query.size && parseInt(req.query.size) > 0 && parseInt(req.query.size) < 500) {
              size = parseInt(req.query.size);
            }

            skip = size * (page - 1) > 0 ? size * (page - 1) : 0;
            _context.prev = 5;
            _context.next = 8;
            return UserModel.estimatedDocumentCount().exec();

          case 8:
            total = _context.sent;
            _context.next = 11;
            return UserModel.find({
              $or: [{
                removed: false
              }, {
                removed: {
                  $exists: false
                }
              }]
            }, '-location -favorites').skip(skip).sort(sorters).limit(size);

          case 11:
            rows = _context.sent;
            data = {
              page: page,
              pages: Math.ceil(total / size),
              total: total,
              size: size,
              rows: rows
            };
            return _context.abrupt("return", res.json({
              success: true,
              data: data
            }));

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](5);
            return _context.abrupt("return", next(_context.t0));

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[5, 16]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.getUserByUsername = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var _req$user, _req$user2;

    var username, isSelf, isAdmin, garageFilters, user;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            username = req.params.username;
            isSelf = ((_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.username) === username;
            isAdmin = (_req$user2 = req.user) === null || _req$user2 === void 0 ? void 0 : _req$user2.isAdmin; //means visitor

            garageFilters = !isSelf && !isAdmin ? {
              activated: true,
              visible: true,
              status: 'active'
            } : {};
            _context2.prev = 4;
            _context2.next = 7;
            return UserModel.findOne({
              username: username,
              $or: [{
                removed: false
              }, {
                removed: {
                  $exists: false
                }
              }]
            }).populate({
              path: 'favorites',
              populate: 'comments',
              match: garageFilters
            }).populate({
              path: 'followers.user',
              model: 'User',
              select: 'avatarUrl firstname username lastname email'
            }).populate({
              path: 'followings.user',
              model: 'User',
              select: 'avatarUrl firstname username lastname email'
            }).populate({
              path: 'garage',
              populate: 'user comments',
              match: garageFilters
            });

          case 7:
            user = _context2.sent;

            if (user) {
              _context2.next = 10;
              break;
            }

            return _context2.abrupt("return", next(Errors.NotFoundError(Messages.errors.user_not_found)));

          case 10:
            return _context2.abrupt("return", res.json({
              success: true,
              data: {
                isAdmin: isAdmin,
                isSelf: isSelf,
                user: user
              }
            }));

          case 13:
            _context2.prev = 13;
            _context2.t0 = _context2["catch"](4);
            next(_context2.t0);

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[4, 13]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.saveAuthedUser = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var doc;
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
            _context3.prev = 2;
            _context3.next = 5;
            return req.user.save();

          case 5:
            doc = _context3.sent;
            return _context3.abrupt("return", res.status(200).json({
              success: true,
              data: doc
            }));

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](2);
            next(_context3.t0);

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[2, 9]]);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

exports.saveUserByUsername = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var user, doc;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return UserModel.findOne({
              username: req.params.username
            });

          case 3:
            user = _context4.sent;

            if (user) {
              _context4.next = 6;
              break;
            }

            return _context4.abrupt("return", next(Errors.NotFoundError(Messages.errors.user_not_found)));

          case 6:
            _context4.next = 8;
            return user.save();

          case 8:
            doc = _context4.sent;
            return _context4.abrupt("return", res.status(200).json({
              success: true,
              data: doc
            }));

          case 12:
            _context4.prev = 12;
            _context4.t0 = _context4["catch"](0);
            next(_context4.t0);

          case 15:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 12]]);
  }));

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();

exports.updateUser = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var allowedFieldsUpdatesSet, updatesSet, doc;
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
            allowedFieldsUpdatesSet = ['firstname', 'lastname', 'about', 'phone', 'company.name', 'company.siren', 'company.owner', 'countrySelect', 'socials.facebook', 'socials.twitter', 'address.housenumber', 'address.street', 'address.postCode', 'address.city', 'address.fullAddress', 'address.country'];
            updatesSet = allowedFieldsUpdatesSet.reduce(function (carry, key) {
              var value = functions.resolveObjectKey(req.body, key);

              if (value) {
                return _objectSpread(_objectSpread({}, carry), {}, (0, _defineProperty2["default"])({}, key, value));
              } else {
                return carry;
              }
            }, {});
            _context5.prev = 4;
            _context5.next = 7;
            return UserModel.updateOne({
              _id: req.user.id
            }, {
              $set: updatesSet
            }, {
              returnNewDocument: true,
              runValidators: true
            });

          case 7:
            doc = _context5.sent;
            return _context5.abrupt("return", res.status(200).json({
              success: true,
              data: doc
            }));

          case 11:
            _context5.prev = 11;
            _context5.t0 = _context5["catch"](4);
            return _context5.abrupt("return", next(_context5.t0));

          case 14:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[4, 11]]);
  }));

  return function (_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}();

exports.updateAdminUser = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var username, doc;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            username = req.params.username;

            if (username) {
              _context6.next = 3;
              break;
            }

            return _context6.abrupt("return", next(Errors.NotFoundError(Messages.errors.user_not_found)));

          case 3:
            _context6.prev = 3;
            _context6.next = 6;
            return UserModel.updateOne({
              username: username
            }, {
              $set: req.body
            }, {
              returnNewDocument: true,
              runValidators: true
            });

          case 6:
            doc = _context6.sent;
            return _context6.abrupt("return", res.json({
              success: true,
              data: doc
            }));

          case 10:
            _context6.prev = 10;
            _context6.t0 = _context6["catch"](3);
            return _context6.abrupt("return", next(_context6.t0));

          case 13:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[3, 10]]);
  }));

  return function (_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}();

exports.uploadAvatar = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var _req$uploadedFiles, _req$uploadedFiles$av;

    var document;
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
            req.user.avatar = (_req$uploadedFiles = req.uploadedFiles) === null || _req$uploadedFiles === void 0 ? void 0 : (_req$uploadedFiles$av = _req$uploadedFiles.avatar) === null || _req$uploadedFiles$av === void 0 ? void 0 : _req$uploadedFiles$av[0];
            _context7.prev = 3;
            _context7.next = 6;
            return req.user.save();

          case 6:
            document = _context7.sent;
            return _context7.abrupt("return", res.json({
              success: true,
              data: document
            }));

          case 10:
            _context7.prev = 10;
            _context7.t0 = _context7["catch"](3);
            next(_context7.t0);

          case 13:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[3, 10]]);
  }));

  return function (_x19, _x20, _x21) {
    return _ref7.apply(this, arguments);
  };
}();

exports.deleteUser = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    var doc;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
            return UserModel.updateOne({
              username: req.params.username
            }, {
              removed: true
            });

          case 3:
            doc = _context8.sent;
            return _context8.abrupt("return", res.json({
              success: true,
              data: doc
            }));

          case 7:
            _context8.prev = 7;
            _context8.t0 = _context8["catch"](0);
            return _context8.abrupt("return", next(_context8.t0));

          case 10:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 7]]);
  }));

  return function (_x22, _x23, _x24) {
    return _ref8.apply(this, arguments);
  };
}();

exports.addFavoriteAnnounceAction = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res, next) {
    var announceId, announce, insertion;
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
            announceId = req.params.announce_id;
            _context9.next = 5;
            return AnnounceModel.findById(announceId);

          case 5:
            announce = _context9.sent;

            if (announce) {
              _context9.next = 8;
              break;
            }

            return _context9.abrupt("return", next(Errors.NotFoundError(Messages.errors.announce_not_found)));

          case 8:
            if (!(req.user.id.toString() === announce.user.toString())) {
              _context9.next = 10;
              break;
            }

            return _context9.abrupt("return", next(Errors.Error(Messages.errors.not_allowed)));

          case 10:
            _context9.prev = 10;
            _context9.next = 13;
            return UserModel.updateOne({
              _id: req.user.id
            }, {
              $addToSet: {
                favorites: announceId
              }
            }, {
              runValidators: true
            });

          case 13:
            insertion = _context9.sent;
            return _context9.abrupt("return", res.json({
              success: true,
              data: insertion
            }));

          case 17:
            _context9.prev = 17;
            _context9.t0 = _context9["catch"](10);
            return _context9.abrupt("return", next(_context9.t0));

          case 20:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[10, 17]]);
  }));

  return function (_x25, _x26, _x27) {
    return _ref9.apply(this, arguments);
  };
}();

exports.rmFavoriteAnnounceAction = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res, next) {
    var announceId, announce, suppression;
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
            announceId = req.params.announce_id;
            _context10.next = 5;
            return AnnounceModel.findById(announceId);

          case 5:
            announce = _context10.sent;

            if (announce) {
              _context10.next = 8;
              break;
            }

            return _context10.abrupt("return", next(Errors.NotFoundError(Messages.errors.announce_not_found)));

          case 8:
            _context10.prev = 8;
            _context10.next = 11;
            return UserModel.updateOne({
              _id: req.user.id
            }, {
              $pull: {
                favorites: announceId
              }
            }, {
              runValidators: true
            });

          case 11:
            suppression = _context10.sent;
            return _context10.abrupt("return", res.json({
              success: true,
              data: suppression
            }));

          case 15:
            _context10.prev = 15;
            _context10.t0 = _context10["catch"](8);
            return _context10.abrupt("return", next(_context10.t0));

          case 18:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[8, 15]]);
  }));

  return function (_x28, _x29, _x30) {
    return _ref10.apply(this, arguments);
  };
}();

exports.followUserAction = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
    var userId, insertion, doc;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            userId = req.params.user_id;

            if (req.user) {
              _context11.next = 3;
              break;
            }

            return _context11.abrupt("return", next(Errors.UnAuthorizedError(Messages.errors.user_not_found)));

          case 3:
            if (!(req.user.id.toString() === userId)) {
              _context11.next = 5;
              break;
            }

            return _context11.abrupt("return", next(Errors.Error(Messages.errors.not_allowed)));

          case 5:
            _context11.prev = 5;
            _context11.next = 8;
            return UserModel.updateOne({
              _id: userId
            }, {
              $addToSet: {
                followers: {
                  user: req.user.id
                }
              }
            }, {
              runValidators: true
            });

          case 8:
            insertion = _context11.sent;

            if (insertion) {
              _context11.next = 11;
              break;
            }

            return _context11.abrupt("return", next(Errors.NotFoundError(Messages.errors.user_not_found)));

          case 11:
            _context11.next = 13;
            return UserModel.updateOne({
              _id: req.user.id
            }, {
              $addToSet: {
                followings: {
                  user: userId
                }
              }
            });

          case 13:
            doc = _context11.sent;
            return _context11.abrupt("return", res.json({
              success: true,
              data: {
                doc: doc,
                insertion: insertion
              }
            }));

          case 17:
            _context11.prev = 17;
            _context11.t0 = _context11["catch"](5);
            return _context11.abrupt("return", next(_context11.t0));

          case 20:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[5, 17]]);
  }));

  return function (_x31, _x32, _x33) {
    return _ref11.apply(this, arguments);
  };
}();

exports.unFollowUserAction = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res, next) {
    var userId, suppression, doc;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            userId = req.params.user_id;

            if (req.user) {
              _context12.next = 3;
              break;
            }

            return _context12.abrupt("return", next(Errors.UnAuthorizedError(Messages.errors.user_not_found)));

          case 3:
            if (!(req.user.id.toString() === userId)) {
              _context12.next = 5;
              break;
            }

            return _context12.abrupt("return", next(Errors.Error(Messages.errors.not_allowed)));

          case 5:
            _context12.prev = 5;
            _context12.next = 8;
            return UserModel.updateOne({
              _id: userId
            }, {
              $pull: {
                followers: {
                  user: req.user.id
                }
              }
            }, {
              runValidators: true
            });

          case 8:
            suppression = _context12.sent;

            if (suppression) {
              _context12.next = 11;
              break;
            }

            return _context12.abrupt("return", next(Errors.NotFoundError(Messages.errors.user_not_found)));

          case 11:
            _context12.next = 13;
            return UserModel.updateOne({
              _id: req.user.id
            }, {
              $pull: {
                followings: {
                  user: userId
                }
              }
            });

          case 13:
            doc = _context12.sent;
            return _context12.abrupt("return", res.json({
              success: true,
              data: {
                doc: doc,
                suppression: suppression
              }
            }));

          case 17:
            _context12.prev = 17;
            _context12.t0 = _context12["catch"](5);
            return _context12.abrupt("return", next(_context12.t0));

          case 20:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[5, 17]]);
  }));

  return function (_x34, _x35, _x36) {
    return _ref12.apply(this, arguments);
  };
}();

exports.subscribeNewsletter = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res, next) {
    var email, _req$body$active, doc;

    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            email = req.body.email;

            if (email) {
              _context13.next = 3;
              break;
            }

            return _context13.abrupt("return", next(Errors.NotFoundError(Messages.errors.missing_or_invalid_email)));

          case 3:
            _context13.prev = 3;
            _context13.next = 6;
            return NewsletterSubscriber.updateOne({
              email: email
            }, {
              email: email,
              active: (_req$body$active = req.body.active) !== null && _req$body$active !== void 0 ? _req$body$active : true
            }, {
              upsert: true
            });

          case 6:
            doc = _context13.sent;
            return _context13.abrupt("return", res.json({
              success: true,
              data: doc
            }));

          case 10:
            _context13.prev = 10;
            _context13.t0 = _context13["catch"](3);
            return _context13.abrupt("return", next(_context13.t0));

          case 13:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[3, 10]]);
  }));

  return function (_x37, _x38, _x39) {
    return _ref13.apply(this, arguments);
  };
}();

exports.contact = /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(req, res, next) {
    var _req$body, email, subject, message, post, doc, date;

    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _req$body = req.body, email = _req$body.email, subject = _req$body.subject, message = _req$body.message;

            if (email) {
              _context14.next = 3;
              break;
            }

            return _context14.abrupt("return", next(Errors.NotFoundError(Messages.errors.missing_or_invalid_email)));

          case 3:
            _context14.prev = 3;
            post = new ContactMessage({
              email: email,
              subject: subject,
              message: message
            });
            _context14.next = 7;
            return post.save();

          case 7:
            doc = _context14.sent;
            date = moment(doc.createdAt).format('YYYY-MM-DD-HH-MM');
            _context14.next = 11;
            return usersMailer.contactFormToAdmin({
              email: email,
              subject: subject,
              message: message,
              date: date
            });

          case 11:
            return _context14.abrupt("return", res.json({
              success: true
            }));

          case 14:
            _context14.prev = 14;
            _context14.t0 = _context14["catch"](3);
            return _context14.abrupt("return", next(_context14.t0));

          case 17:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, null, [[3, 14]]);
  }));

  return function (_x40, _x41, _x42) {
    return _ref14.apply(this, arguments);
  };
}();