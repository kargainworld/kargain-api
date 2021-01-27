"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var AnnounceModel = require('../models').Announce;

var UserModel = require('../models').User;

var Errors = require('../utils/errors');

var Messages = require('../utils/messages');

var unionBy = require('lodash').unionBy;

var fetchAnnounces = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req) {
    var _req$query, _req$query$q, _req$user;

    var sorters, queryString, isAuthenticated, isPro, announceQuery, fetchSearch, _announceQuery, $text, rest, fetchPopulate;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            sorters = {
              createdAt: -1
            };
            queryString = (_req$query = req.query) === null || _req$query === void 0 ? void 0 : (_req$query$q = _req$query.q) === null || _req$query$q === void 0 ? void 0 : _req$query$q.toLowerCase(); //fetching single profile

            isAuthenticated = !!req.user;
            isPro = !isAuthenticated ? false : Boolean(((_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.isPro) || false);
            announceQuery = {
              $text: {
                $search: queryString // diacriticSensitive : true

              },
              visible: true,
              activated: true,
              status: 'active' //enum['deleted', 'archived', 'active']

            };

            if (!isPro) {
              announceQuery = _objectSpread(_objectSpread({}, announceQuery), {}, {
                adType: {
                  $ne: 'sale-pro'
                }
              });
            }

            _context.next = 8;
            return AnnounceModel.find(announceQuery, '-damages').sort(sorters).populate({
              path: 'manufacturer.make'
            }).populate({
              path: 'manufacturer.model'
            }).populate({
              path: 'user',
              select: '-followings -followers -favorites -garage'
            });

          case 8:
            fetchSearch = _context.sent;
            _announceQuery = announceQuery, $text = _announceQuery.$text, rest = (0, _objectWithoutProperties2["default"])(_announceQuery, ["$text"]);
            _context.next = 12;
            return AnnounceModel.find(rest, '-damages').sort(sorters).populate({
              path: 'manufacturer.make'
            }).populate({
              path: 'manufacturer.model'
            });

          case 12:
            fetchPopulate = _context.sent;
            fetchPopulate = fetchPopulate.filter(function (row) {
              var _row$manufacturer$mak, _row$manufacturer$mod;

              if ((_row$manufacturer$mak = row.manufacturer.make) === null || _row$manufacturer$mak === void 0 ? void 0 : _row$manufacturer$mak.make_slug.includes(queryString)) {
                return true;
              }

              if ((_row$manufacturer$mod = row.manufacturer.model) === null || _row$manufacturer$mod === void 0 ? void 0 : _row$manufacturer$mod.model.includes(queryString)) {
                return true;
              }
            });
            return _context.abrupt("return", unionBy(fetchSearch, fetchPopulate, '_id'));

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchAnnounces(_x) {
    return _ref.apply(this, arguments);
  };
}();

var fetchUsers = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req) {
    var _req$query2, _req$query2$q;

    var sorters, queryString, query;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            sorters = {
              createdAt: -1
            };
            queryString = (_req$query2 = req.query) === null || _req$query2 === void 0 ? void 0 : (_req$query2$q = _req$query2.q) === null || _req$query2$q === void 0 ? void 0 : _req$query2$q.toLowerCase();
            query = {
              $text: {
                $search: queryString // diacriticSensitive : true

              },
              $or: [{
                removed: false
              }, {
                removed: {
                  $exists: false
                }
              }]
            };
            _context2.next = 5;
            return UserModel.find(query, '-location -favorites').sort(sorters);

          case 5:
            return _context2.abrupt("return", _context2.sent);

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function fetchUsers(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.filterSearchAction = function () {
  return /*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
      var _req$query3, _req$query3$q;

      var queryString, announces, users;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              queryString = (_req$query3 = req.query) === null || _req$query3 === void 0 ? void 0 : (_req$query3$q = _req$query3.q) === null || _req$query3$q === void 0 ? void 0 : _req$query3$q.toLowerCase();

              if (queryString) {
                _context3.next = 3;
                break;
              }

              return _context3.abrupt("return", next(Errors.NotFoundError(Messages.errors.query_is_empty)));

            case 3:
              _context3.prev = 3;
              _context3.next = 6;
              return fetchAnnounces(req);

            case 6:
              announces = _context3.sent;
              _context3.next = 9;
              return fetchUsers(req);

            case 9:
              users = _context3.sent;
              return _context3.abrupt("return", res.json({
                success: true,
                data: {
                  announces: announces,
                  users: users
                }
              }));

            case 13:
              _context3.prev = 13;
              _context3.t0 = _context3["catch"](3);
              return _context3.abrupt("return", next(_context3.t0));

            case 16:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[3, 13]]);
    }));

    return function (_x3, _x4, _x5) {
      return _ref3.apply(this, arguments);
    };
  }();
};