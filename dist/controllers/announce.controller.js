"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var mongoose = require('mongoose');

var config = require('../config');

var AnnounceModel = require('../models').Announce;

var UserModel = require('../models').User;

var Errors = require('../utils/errors');

var Messages = require('../utils/messages');

var functions = require('../utils/helpers');

var allowedFieldsUpdatesSet = require('../utils/allowedFields');

var prepareFilters = require('../components/filters/prepareFilters');

var announcesSorterMapper = require('../components/filters/announcesSorterMapper');

var AnnounceMailer = require('../components/mailer').announces;

var notifier = require('../components/notifications/notifier');

var DEFAULT_RESULTS_PER_PAGE = 10;

exports.getAnnouncesAdminAction = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var page, _req$query, sort_by, sort_ord, size, sorters, sortBy, sortOrder, skip, rows, total, data;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            page = req.query.page && parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
            _req$query = req.query, sort_by = _req$query.sort_by, sort_ord = _req$query.sort_ord;
            size = 50;
            sorters = {
              createdAt: -1
            }; //sorter

            if (sort_by) {
              sortBy = announcesSorterMapper[sort_by];
              sortOrder = sort_ord ? sort_ord === 'ASC' ? 1 : -1 : -1;

              if (sortBy && sortOrder) {
                sorters = _objectSpread((0, _defineProperty2["default"])({}, sortBy, sortOrder), sorters);
              }
            }

            if (req.query.size && parseInt(req.query.size) > 0 && parseInt(req.query.size) < 500) {
              size = parseInt(req.query.size);
            }

            skip = size * (page - 1) > 0 ? size * (page - 1) : 0;
            _context.prev = 7;
            _context.next = 10;
            return AnnounceModel.find({}, '-damages').skip(skip).sort(sorters).limit(size).populate({
              path: 'manufacturer.make'
            }).populate({
              path: 'manufacturer.model'
            }).populate({
              path: 'user',
              select: '-followings -followers -favorites -garage'
            }).populate({
              path: 'comments',
              select: '-announce -responses -likes',
              populate: {
                path: 'user',
                select: '-followings -followers -favorites -garage'
              }
            });

          case 10:
            rows = _context.sent;
            _context.next = 13;
            return AnnounceModel.find().estimatedDocumentCount();

          case 13:
            total = _context.sent;
            data = {
              pages: Math.ceil(total / size),
              page: page,
              total: total,
              size: size,
              rows: rows
            };
            return _context.abrupt("return", res.json({
              success: true,
              data: data
            }));

          case 18:
            _context.prev = 18;
            _context.t0 = _context["catch"](7);
            return _context.abrupt("return", next(_context.t0));

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[7, 18]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.filterAnnouncesAction = function () {
  var fetchProfile = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var fetchFeed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var returnCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
      var _req$query$user$toStr, _req$query3, _req$query3$user, _req$user, _req$user$id, _req$user2, _req$user2$id, _req$user3;

      var _req$query2, sort_by, sort_ord, page, size, sorters, qSize, skip, sortBy, sortOrder, defaultQuery, user, isSelf, isPro, _req$user4, followingIds, query, _req$query4, MAKE, MODEL, makesFilter, modelsFilter, rows, filtered, total, data;

      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _req$query2 = req.query, sort_by = _req$query2.sort_by, sort_ord = _req$query2.sort_ord;
              page = req.query.page && parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
              size = DEFAULT_RESULTS_PER_PAGE;
              sorters = {
                createdAt: -1
              };
              qSize = parseInt(req.query.size);

              if (qSize > 0 && qSize < 500) {
                size = qSize;
              }

              skip = size * (page - 1) > 0 ? size * (page - 1) : 0; //sorter

              if (sort_by) {
                sortBy = announcesSorterMapper[sort_by];
                sortOrder = sort_ord ? sort_ord === 'ASC' ? 1 : -1 : -1;

                if (sortBy && sortOrder) {
                  sorters = _objectSpread((0, _defineProperty2["default"])({}, sortBy, sortOrder), sorters);
                }
              }

              defaultQuery = {}; //fetching single profile

              user = (_req$query$user$toStr = (_req$query3 = req.query) === null || _req$query3 === void 0 ? void 0 : (_req$query3$user = _req$query3.user) === null || _req$query3$user === void 0 ? void 0 : _req$query3$user.toString()) !== null && _req$query$user$toStr !== void 0 ? _req$query$user$toStr : req === null || req === void 0 ? void 0 : (_req$user = req.user) === null || _req$user === void 0 ? void 0 : (_req$user$id = _req$user.id) === null || _req$user$id === void 0 ? void 0 : _req$user$id.toString();
              isSelf = user && (req === null || req === void 0 ? void 0 : (_req$user2 = req.user) === null || _req$user2 === void 0 ? void 0 : (_req$user2$id = _req$user2.id) === null || _req$user2$id === void 0 ? void 0 : _req$user2$id.toString()) === user;
              isPro = Boolean(((_req$user3 = req.user) === null || _req$user3 === void 0 ? void 0 : _req$user3.isPro) || false);

              if (!isPro) {
                defaultQuery.adType = {
                  $ne: 'sale-pro'
                };
              }

              if (fetchProfile && user) {
                defaultQuery = _objectSpread(_objectSpread({}, defaultQuery), {}, {
                  user: user
                }); //restrict to published announces

                if (!isSelf) {
                  defaultQuery = _objectSpread(_objectSpread({}, defaultQuery), {}, {
                    visible: true,
                    activated: true,
                    status: 'active' //enum['deleted', 'archived', 'active']

                  });
                }
              } //fetch public announces
              else {
                  //fetch user feed profiles
                  if (fetchFeed) {
                    followingIds = (req === null || req === void 0 ? void 0 : (_req$user4 = req.user) === null || _req$user4 === void 0 ? void 0 : _req$user4.followings) ? req.user.followings.map(function (following) {
                      return following.user;
                    }) : [];

                    if (followingIds.length !== 0) {
                      defaultQuery = _objectSpread(_objectSpread({}, defaultQuery), {}, {
                        user: {
                          $in: followingIds
                        }
                      });
                    }
                  } //search in all announces
                  else {
                      defaultQuery = _objectSpread(_objectSpread({}, defaultQuery), {}, {
                        visible: true,
                        activated: true,
                        status: 'active' //enum['deleted', 'archived', 'active']

                      });
                    }
                }

              query = prepareFilters(req.query, defaultQuery);
              _req$query4 = req.query, MAKE = _req$query4.MAKE, MODEL = _req$query4.MODEL;
              makesFilter = !Array.isArray(MAKE) ? [MAKE] : MAKE;
              modelsFilter = !Array.isArray(MODEL) ? [MODEL] : MODEL;
              makesFilter = makesFilter.filter(function (make) {
                return typeof make === 'string';
              }).map(function (make) {
                return make.toLowerCase();
              });
              modelsFilter = modelsFilter.filter(function (model) {
                return typeof model === 'string';
              }).map(function (model) {
                return model.toLowerCase();
              });
              _context2.prev = 20;
              _context2.next = 23;
              return AnnounceModel.find(query, '-damages').skip(skip).sort(sorters).limit(size).populate('images').populate({
                path: 'manufacturer.make'
              }).populate({
                path: 'manufacturer.model'
              }).populate({
                path: 'user',
                select: '-followings -followers -favorites -garage'
              }).populate({
                path: 'comments',
                select: '-announce -responses -likes',
                populate: {
                  path: 'user',
                  select: '-followings -followers -favorites -garage'
                }
              });

            case 23:
              rows = _context2.sent;
              filtered = rows.filter(function (row) {
                var _row$manufacturer, _row$manufacturer$mak;

                return makesFilter.length ? makesFilter.includes((_row$manufacturer = row.manufacturer) === null || _row$manufacturer === void 0 ? void 0 : (_row$manufacturer$mak = _row$manufacturer.make) === null || _row$manufacturer$mak === void 0 ? void 0 : _row$manufacturer$mak.make_slug) : true;
              }).filter(function (row) {
                var _row$manufacturer2, _row$manufacturer2$mo;

                return modelsFilter.length ? modelsFilter.includes((_row$manufacturer2 = row.manufacturer) === null || _row$manufacturer2 === void 0 ? void 0 : (_row$manufacturer2$mo = _row$manufacturer2.model) === null || _row$manufacturer2$mo === void 0 ? void 0 : _row$manufacturer2$mo.model) : true;
              });
              _context2.next = 27;
              return AnnounceModel.find(query).count();

            case 27:
              total = _context2.sent;
              data = {
                page: page,
                size: size,
                query: query,
                pages: Math.ceil(total / size),
                total: filtered.length,
                rows: !returnCount ? filtered : null
              };
              return _context2.abrupt("return", res.json({
                success: true,
                data: data
              }));

            case 32:
              _context2.prev = 32;
              _context2.t0 = _context2["catch"](20);
              return _context2.abrupt("return", next(_context2.t0));

            case 35:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[20, 32]]);
    }));

    return function (_x4, _x5, _x6) {
      return _ref2.apply(this, arguments);
    };
  }();
};

exports.getAnnounceBySlugAction = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var announce, isSelf, isAdmin, displayAd;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return AnnounceModel.findOne({
              slug: req.params.slug
            }).populate('user').populate({
              path: 'likes.user',
              select: 'avatarUrl firstname username lastname email'
            }).populate({
              path: 'manufacturer.make'
            }).populate({
              path: 'manufacturer.model'
            }).populate({
              path: 'comments',
              match: {
                enabled: true
              },
              populate: {
                path: 'user',
                select: 'avatarUrl firstname username lastname email'
              }
            });

          case 3:
            announce = _context3.sent;

            if (!announce) {
              _context3.next = 12;
              break;
            }

            isSelf = req.user ? (req === null || req === void 0 ? void 0 : req.user.id.toString()) === announce.user.id.toString() : false;
            isAdmin = req.user ? req.user.isAdmin : false;

            if (!(isAdmin || isSelf)) {
              _context3.next = 9;
              break;
            }

            return _context3.abrupt("return", res.json({
              success: true,
              data: {
                announce: announce,
                isSelf: isSelf,
                isAdmin: isAdmin
              }
            }));

          case 9:
            displayAd = announce.activated && announce.visible && announce.status === 'active';

            if (!displayAd) {
              _context3.next = 12;
              break;
            }

            return _context3.abrupt("return", res.json({
              success: true,
              data: {
                announce: announce
              }
            }));

          case 12:
            return _context3.abrupt("return", next(Errors.NotFoundError(Messages.errors.announce_not_found)));

          case 15:
            _context3.prev = 15;
            _context3.t0 = _context3["catch"](0);
            return _context3.abrupt("return", next(_context3.t0));

          case 18:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 15]]);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getBySlugAndNextAction = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var announce;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return AnnounceModel.findOne({
              slug: req.params.slug
            }).populate({
              path: 'manufacturer.make'
            }).populate({
              path: 'manufacturer.model'
            });

          case 3:
            announce = _context4.sent;

            if (!announce) {
              _context4.next = 7;
              break;
            }

            req.announce = announce;
            return _context4.abrupt("return", next());

          case 7:
            return _context4.abrupt("return", next(Errors.NotFoundError(Messages.errors.announce_not_found)));

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4["catch"](0);
            return _context4.abrupt("return", next(_context4.t0));

          case 13:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 10]]);
  }));

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();

exports.createAnnounceAction = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var _req$body, vehicleType, manufacturer, disable, modelMake, modelModel, matchMake, matchModel, _manufacturer$make, _manufacturer$make3, _manufacturer$model, _manufacturer$year3, _req$body$address$hou, _req$body2, _req$body2$address, _matchMake, _matchModel, _doc$images$0$locatio, _doc$images, _doc$images$, _doc$manufacturer, _doc$manufacturer$mak, _doc$manufacturer2, _doc$manufacturer2$mo, _doc$manufacturer3, _doc$manufacturer3$ge, _manufacturer$make2, _manufacturer$year, _manufacturer$year2, manufacturerTitle, data, announce, doc, announce_link;

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
            _req$body = req.body, vehicleType = _req$body.vehicleType, manufacturer = _req$body.manufacturer; //automatically disable announce

            disable = req.user.garage.length >= req.user.config.garageLengthAllowed;
            modelMake = require('../models').Vehicles.Makes["".concat(vehicleType, "s")];
            modelModel = require('../models').Vehicles.Models["".concat(vehicleType, "s")];
            matchMake = null;
            matchModel = null;
            _context5.prev = 8;

            if (!(modelMake && (manufacturer === null || manufacturer === void 0 ? void 0 : (_manufacturer$make = manufacturer.make) === null || _manufacturer$make === void 0 ? void 0 : _manufacturer$make.value))) {
              _context5.next = 17;
              break;
            }

            _context5.next = 12;
            return modelMake.findOne({
              _id: mongoose.Types.ObjectId(manufacturer === null || manufacturer === void 0 ? void 0 : (_manufacturer$make2 = manufacturer.make) === null || _manufacturer$make2 === void 0 ? void 0 : _manufacturer$make2.value)
            });

          case 12:
            matchMake = _context5.sent;

            if (!(modelModel && (manufacturer === null || manufacturer === void 0 ? void 0 : (_manufacturer$year = manufacturer.year) === null || _manufacturer$year === void 0 ? void 0 : _manufacturer$year.value))) {
              _context5.next = 17;
              break;
            }

            _context5.next = 16;
            return modelModel.findOne({
              _id: mongoose.Types.ObjectId(manufacturer === null || manufacturer === void 0 ? void 0 : (_manufacturer$year2 = manufacturer.year) === null || _manufacturer$year2 === void 0 ? void 0 : _manufacturer$year2.value)
            });

          case 16:
            matchModel = _context5.sent;

          case 17:
            manufacturerTitle = [manufacturer === null || manufacturer === void 0 ? void 0 : (_manufacturer$make3 = manufacturer.make) === null || _manufacturer$make3 === void 0 ? void 0 : _manufacturer$make3.label, manufacturer === null || manufacturer === void 0 ? void 0 : (_manufacturer$model = manufacturer.model) === null || _manufacturer$model === void 0 ? void 0 : _manufacturer$model.label, manufacturer === null || manufacturer === void 0 ? void 0 : (_manufacturer$year3 = manufacturer.year) === null || _manufacturer$year3 === void 0 ? void 0 : _manufacturer$year3.label].filter(function (part) {
              return part;
            }).join(' - ');
            data = _objectSpread(_objectSpread({}, req.body), {}, {
              user: req.user,
              title: manufacturerTitle,
              activated: false,
              visible: disable,
              makeRef: "".concat(vehicleType, "s_makes"),
              modelRef: "".concat(vehicleType, "s_models"),
              address: _objectSpread(_objectSpread({}, req.body.address), {}, {
                housenumber: Number((_req$body$address$hou = (_req$body2 = req.body) === null || _req$body2 === void 0 ? void 0 : (_req$body2$address = _req$body2.address) === null || _req$body2$address === void 0 ? void 0 : _req$body2$address.housenumber) !== null && _req$body$address$hou !== void 0 ? _req$body$address$hou : null)
              }),
              manufacturer: {
                make: (_matchMake = matchMake) === null || _matchMake === void 0 ? void 0 : _matchMake._id,
                model: (_matchModel = matchModel) === null || _matchModel === void 0 ? void 0 : _matchModel._id
              }
            });
            console.log(data);
            announce = new AnnounceModel(data);
            _context5.next = 23;
            return announce.save();

          case 23:
            doc = _context5.sent;
            _context5.next = 26;
            return UserModel.findOneAndUpdate({
              _id: req.user.id
            }, {
              $addToSet: {
                garage: doc._id
              }
            });

          case 26:
            announce_link = "".concat(config.frontend, "/announces/").concat(doc.toObject().slug);
            _context5.next = 29;
            return AnnounceMailer.confirmCreateAnnounce({
              email: req.user.email,
              firstname: req.user.firstname,
              lastname: req.user.lastname,
              announce_link: announce_link,
              featured_img_link: (_doc$images$0$locatio = doc === null || doc === void 0 ? void 0 : (_doc$images = doc.images) === null || _doc$images === void 0 ? void 0 : (_doc$images$ = _doc$images[0]) === null || _doc$images$ === void 0 ? void 0 : _doc$images$.location) !== null && _doc$images$0$locatio !== void 0 ? _doc$images$0$locatio : 'https://kargain.s3.eu-west-3.amazonaws.com/uploads/2020/05/30670681-d44d-468e-bf82-533733bb507e.JPG',
              manufacturer: {
                make: doc === null || doc === void 0 ? void 0 : (_doc$manufacturer = doc.manufacturer) === null || _doc$manufacturer === void 0 ? void 0 : (_doc$manufacturer$mak = _doc$manufacturer.make) === null || _doc$manufacturer$mak === void 0 ? void 0 : _doc$manufacturer$mak.label,
                model: doc === null || doc === void 0 ? void 0 : (_doc$manufacturer2 = doc.manufacturer) === null || _doc$manufacturer2 === void 0 ? void 0 : (_doc$manufacturer2$mo = _doc$manufacturer2.model) === null || _doc$manufacturer2$mo === void 0 ? void 0 : _doc$manufacturer2$mo.label,
                generation: doc === null || doc === void 0 ? void 0 : (_doc$manufacturer3 = doc.manufacturer) === null || _doc$manufacturer3 === void 0 ? void 0 : (_doc$manufacturer3$ge = _doc$manufacturer3.generation) === null || _doc$manufacturer3$ge === void 0 ? void 0 : _doc$manufacturer3$ge.label
              }
            });

          case 29:
            _context5.next = 31;
            return notifier.postNotification({
              uid: req.user.id,
              message: 'Announce created',
              action: announce_link
            });

          case 31:
            return _context5.abrupt("return", res.json({
              success: true,
              data: doc
            }));

          case 34:
            _context5.prev = 34;
            _context5.t0 = _context5["catch"](8);
            next(_context5.t0);

          case 37:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[8, 34]]);
  }));

  return function (_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}();

exports.updateAnnounceAction = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var updatesSet, doc, announce_link;
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
            updatesSet = allowedFieldsUpdatesSet.reduce(function (carry, key) {
              var value = functions.resolveObjectKey(req.body, key);

              if (value) {
                return _objectSpread(_objectSpread({}, carry), {}, (0, _defineProperty2["default"])({}, key, value));
              } else {
                return carry;
              }
            }, {});
            _context6.prev = 3;
            _context6.next = 6;
            return AnnounceModel.findOneAndUpdate({
              slug: req.params.slug
            }, {
              $set: updatesSet
            }, {
              returnNewDocument: true,
              runValidators: true,
              context: 'query'
            });

          case 6:
            doc = _context6.sent;
            announce_link = "".concat(config.frontend, "/announces/").concat(doc.toObject().slug);
            _context6.next = 10;
            return notifier.postNotification({
              uid: req.user.id,
              message: 'Announce updated',
              action: announce_link
            });

          case 10:
            return _context6.abrupt("return", res.json({
              success: true,
              data: doc
            }));

          case 13:
            _context6.prev = 13;
            _context6.t0 = _context6["catch"](3);
            return _context6.abrupt("return", next(_context6.t0));

          case 16:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[3, 13]]);
  }));

  return function (_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}();

exports.removeAnnounceAction = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var doc;
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
            _context7.prev = 2;
            _context7.next = 5;
            return AnnounceModel.updateOne({
              slug: req.params.slug
            }, {
              $set: {
                status: 'deleted'
              }
            }, {
              returnNewDocument: true,
              runValidators: true,
              context: 'query'
            });

          case 5:
            doc = _context7.sent;
            _context7.next = 8;
            return notifier.postNotification({
              uid: req.user.id,
              message: 'An announce had been removed'
            });

          case 8:
            return _context7.abrupt("return", res.json({
              success: true,
              data: doc
            }));

          case 11:
            _context7.prev = 11;
            _context7.t0 = _context7["catch"](2);
            return _context7.abrupt("return", next(_context7.t0));

          case 14:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[2, 11]]);
  }));

  return function (_x19, _x20, _x21) {
    return _ref7.apply(this, arguments);
  };
}();

exports.updateAdminAnnounceAction = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    var _req$body3;

    var slug, activated, doc, announce_link, _doc$images$0$locatio2, _doc$images2, _doc$images2$;

    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            slug = req.params.slug;
            activated = Boolean((_req$body3 = req.body) === null || _req$body3 === void 0 ? void 0 : _req$body3.activated);

            if (slug) {
              _context8.next = 4;
              break;
            }

            return _context8.abrupt("return", next(Errors.NotFoundError(Messages.errors.announce_not_found)));

          case 4:
            _context8.prev = 4;
            _context8.next = 7;
            return AnnounceModel.findOneAndUpdate({
              slug: slug
            }, {
              $set: req.body
            }, {
              returnNewDocument: true,
              runValidators: true
            }).populate({
              path: 'manufacturer.make'
            }).populate({
              path: 'manufacturer.model'
            }).populate('user');

          case 7:
            doc = _context8.sent;
            announce_link = "".concat(config.frontend, "/announces/").concat(doc.toObject().slug);

            if (!activated) {
              _context8.next = 16;
              break;
            }

            _context8.next = 12;
            return AnnounceMailer.successConfirmAnnounce({
              title: doc.title,
              email: doc.user.email,
              firstname: doc.user.firstname,
              lastname: doc.user.lastname,
              announce_link: announce_link,
              featured_img_link: (_doc$images$0$locatio2 = doc === null || doc === void 0 ? void 0 : (_doc$images2 = doc.images) === null || _doc$images2 === void 0 ? void 0 : (_doc$images2$ = _doc$images2[0]) === null || _doc$images2$ === void 0 ? void 0 : _doc$images2$.location) !== null && _doc$images$0$locatio2 !== void 0 ? _doc$images$0$locatio2 : 'https://kargain.s3.eu-west-3.amazonaws.com/uploads/2020/05/30670681-d44d-468e-bf82-533733bb507e.JPG'
            });

          case 12:
            _context8.next = 14;
            return notifier.postNotification({
              uid: req.user.id,
              message: 'Announce activated',
              action: announce_link
            });

          case 14:
            _context8.next = 20;
            break;

          case 16:
            _context8.next = 18;
            return AnnounceMailer.rejectedConfirmAnnounce({
              email: doc.user.email,
              firstname: doc.user.firstname,
              lastname: doc.user.lastname,
              announce_link: announce_link
            });

          case 18:
            _context8.next = 20;
            return notifier.postNotification({
              uid: req.user.id,
              message: 'Announce rejected',
              action: announce_link
            });

          case 20:
            return _context8.abrupt("return", res.json({
              success: true,
              data: doc
            }));

          case 23:
            _context8.prev = 23;
            _context8.t0 = _context8["catch"](4);
            return _context8.abrupt("return", next(_context8.t0));

          case 26:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[4, 23]]);
  }));

  return function (_x22, _x23, _x24) {
    return _ref8.apply(this, arguments);
  };
}();

exports.uploadImagesAction = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res, next) {
    var _req$uploadedFiles, _req$uploadedFiles$im;

    var announce, doc;
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
            if (req.announce) {
              _context9.next = 4;
              break;
            }

            return _context9.abrupt("return", next(Errors.NotFoundError(Messages.errors.announce_not_found)));

          case 4:
            announce = req.announce;

            if ((req === null || req === void 0 ? void 0 : (_req$uploadedFiles = req.uploadedFiles) === null || _req$uploadedFiles === void 0 ? void 0 : (_req$uploadedFiles$im = _req$uploadedFiles.images) === null || _req$uploadedFiles$im === void 0 ? void 0 : _req$uploadedFiles$im.length) !== 0) {
              if (!announce.images) {
                announce.images = [];
              }

              announce.images = [].concat((0, _toConsumableArray2["default"])(announce.images), (0, _toConsumableArray2["default"])(req.uploadedFiles.images));
            }

            _context9.prev = 6;
            _context9.next = 9;
            return announce.save();

          case 9:
            doc = _context9.sent;
            return _context9.abrupt("return", res.json({
              success: true,
              data: doc
            }));

          case 13:
            _context9.prev = 13;
            _context9.t0 = _context9["catch"](6);
            next(_context9.t0);

          case 16:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[6, 13]]);
  }));

  return function (_x25, _x26, _x27) {
    return _ref9.apply(this, arguments);
  };
}();

exports.addUserLikeActionAction = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res, next) {
    var announce_id, updatedAnnounce, announce_link;
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
            announce_id = req.params.announce_id;
            _context10.prev = 3;
            _context10.next = 6;
            return AnnounceModel.findOneAndUpdate({
              _id: announce_id
            }, {
              $addToSet: {
                likes: {
                  user: mongoose.Types.ObjectId(req.user.id)
                }
              }
            }, {
              "new": true,
              runValidators: true
            });

          case 6:
            updatedAnnounce = _context10.sent;
            _context10.next = 9;
            return UserModel.updateOne({
              _id: req.user.id
            }, {
              $addToSet: {
                favorites: announce_id
              }
            }, {
              runValidators: true
            });

          case 9:
            announce_link = "".concat(config.frontend, "/announces/").concat(updatedAnnounce.toObject().slug);
            _context10.next = 12;
            return notifier.postNotification({
              uid: updatedAnnounce.user,
              message: 'Announce updated',
              action: announce_link
            });

          case 12:
            return _context10.abrupt("return", res.json({
              success: true,
              data: {}
            }));

          case 15:
            _context10.prev = 15;
            _context10.t0 = _context10["catch"](3);
            return _context10.abrupt("return", next(_context10.t0));

          case 18:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[3, 15]]);
  }));

  return function (_x28, _x29, _x30) {
    return _ref10.apply(this, arguments);
  };
}();

exports.removeUserLikeActionAction = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
    var announce_id, suppressionLike, suppressionFavorite;
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
            announce_id = req.params.announce_id;
            _context11.prev = 3;
            _context11.next = 6;
            return AnnounceModel.updateOne({
              _id: announce_id
            }, {
              $pull: {
                likes: {
                  user: mongoose.Types.ObjectId(req.user.id)
                }
              }
            }, {
              runValidators: true
            });

          case 6:
            suppressionLike = _context11.sent;
            _context11.next = 9;
            return UserModel.updateOne({
              _id: req.user.id
            }, {
              $pull: {
                favorites: announce_id
              }
            }, {
              runValidators: true
            });

          case 9:
            suppressionFavorite = _context11.sent;
            return _context11.abrupt("return", res.json({
              success: true,
              data: {
                suppressionLike: suppressionLike,
                suppressionFavorite: suppressionFavorite
              }
            }));

          case 13:
            _context11.prev = 13;
            _context11.t0 = _context11["catch"](3);
            return _context11.abrupt("return", next(_context11.t0));

          case 16:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[3, 13]]);
  }));

  return function (_x31, _x32, _x33) {
    return _ref11.apply(this, arguments);
  };
}();

exports.mailToShareAnnounce = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res, next) {
    var _announce$images$0$lo, _announce$images, _announce$images$, announce;

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
            if (req.body.email) {
              _context12.next = 4;
              break;
            }

            return _context12.abrupt("return", Errors.Error(Messages.errors.missing_or_invalid_email));

          case 4:
            _context12.prev = 4;
            _context12.next = 7;
            return AnnounceModel.findOneAndUpdate({
              slug: req.params.slug
            });

          case 7:
            announce = _context12.sent;

            if (announce) {
              _context12.next = 10;
              break;
            }

            return _context12.abrupt("return", Errors.NotFoundError(Messages.errors.announce_not_found));

          case 10:
            _context12.next = 12;
            return AnnounceMailer.shareAnnounceLink({
              fromFullName: req.user.fullname,
              emailTo: req.body.email,
              announce_link: "".concat(config.frontend, "/announces/").concat(announce.toObject().slug),
              featured_img_link: (_announce$images$0$lo = announce === null || announce === void 0 ? void 0 : (_announce$images = announce.images) === null || _announce$images === void 0 ? void 0 : (_announce$images$ = _announce$images[0]) === null || _announce$images$ === void 0 ? void 0 : _announce$images$.location) !== null && _announce$images$0$lo !== void 0 ? _announce$images$0$lo : 'https://kargain.s3.eu-west-3.amazonaws.com/uploads/2020/05/30670681-d44d-468e-bf82-533733bb507e.JPG'
            });

          case 12:
            return _context12.abrupt("return", res.json({
              success: true,
              data: {
                msg: 'sent'
              }
            }));

          case 15:
            _context12.prev = 15;
            _context12.t0 = _context12["catch"](4);
            return _context12.abrupt("return", next(_context12.t0));

          case 18:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[4, 15]]);
  }));

  return function (_x34, _x35, _x36) {
    return _ref12.apply(this, arguments);
  };
}();