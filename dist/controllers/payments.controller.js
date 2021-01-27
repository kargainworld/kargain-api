"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var PaymentModel = require('../models').Payment;

var Errors = require('../utils/errors');

var Messages = require('../utils/messages');

var config = require('../config');

var stripe = require('stripe')(config.isProd ? config.stripe.secret_key : config.stripe.secret_key);

exports.getIntent = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var intent_id, intent;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            intent_id = req.params.intent_id;
            intent = PaymentModel.findOne({
              intent_id: intent_id
            });
            return _context.abrupt("return", res.json({
              client_secret: intent.client_secret
            }));

          case 6:
            _context.prev = 6;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", next(_context.t0));

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 6]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var offers = [{
  maxAnnounces: 10,
  price: 49.9,
  //EUR
  text: 'Vitrine publique ou vitrine location de 10 annonces, vitrine pro de 10 annonces',
  title: 'announces-10',
  niceTitle: 'Announces 10'
}, {
  maxAnnounces: 20,
  price: 99.9,
  //EUR
  title: 'announces-20',
  niceTitle: 'Announces 20'
}, {
  maxAnnounces: 50,
  price: 199.9,
  //EUR
  text: 'Vitrine publique ou vitrine location de 10 annonces, vitrine pro de 10 annonces',
  title: 'announces-100',
  niceTitle: 'Announces 100'
}];

exports.createPaymentIntent = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var product, offer, paymentIntent;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            product = req.body.product;
            offer = offers.find(function (offer) {
              return offer.title === product;
            });

            if (offer) {
              _context2.next = 4;
              break;
            }

            return _context2.abrupt("return", next(Errors.Error(Messages.errors.missing_offer)));

          case 4:
            _context2.prev = 4;
            _context2.next = 7;
            return stripe.paymentIntents.create({
              amount: Number(offer.price || 0) * 10,
              currency: 'eur',
              metadata: {
                integration_check: 'accept_a_payment'
              }
            });

          case 7:
            paymentIntent = _context2.sent;
            return _context2.abrupt("return", res.json({
              success: true,
              data: {
                clientSecret: paymentIntent.client_secret
              }
            }));

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2["catch"](4);
            return _context2.abrupt("return", next(_context2.t0));

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[4, 11]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.createUserSubscription = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var _req$body, payload, offerTitle, offer, payment, docPayment, docUser;

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
            _req$body = req.body, payload = _req$body.payload, offerTitle = _req$body.offerTitle;
            offer = offers.find(function (offer) {
              return offer.title === offerTitle;
            });
            _context3.prev = 4;
            payment = new PaymentModel(_objectSpread(_objectSpread({}, payload), {}, {
              user: req.user,
              offer: {
                name: offer.title,
                title: offer.niceTitle
              }
            }));
            _context3.next = 8;
            return payment.save();

          case 8:
            docPayment = _context3.sent;
            req.user.subscription = docPayment.id;
            req.user.hasProPlan = true;
            _context3.next = 13;
            return req.user.save();

          case 13:
            docUser = _context3.sent;
            return _context3.abrupt("return", res.json({
              success: true,
              data: {
                docPayment: docPayment,
                docUser: docUser
              }
            }));

          case 17:
            _context3.prev = 17;
            _context3.t0 = _context3["catch"](4);
            return _context3.abrupt("return", next(_context3.t0));

          case 20:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[4, 17]]);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();