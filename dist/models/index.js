"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var User = require('./user.model');

var Announce = require('./announce.model');

var VehiclesMakesModels = require('./vehicles/vehicleMake.models');

var VehiclesModelModels = require('./vehicles/vehicleModel.models');

var Media = require('./media.s3.model');

var Comment = require('./comment.model');

var Payment = require('./payment.model');

var NewsletterSubscriber = require('./newsletter.subscriber.model');

var ContactMessage = require('./contact.message.model');

var Conversation = require('./conversations.model');

var Notification = require('./notification.model');

module.exports = {
  User: User,
  Media: Media,
  Comment: Comment,
  Announce: Announce,
  Payment: Payment,
  Conversation: Conversation,
  NewsletterSubscriber: NewsletterSubscriber,
  ContactMessage: ContactMessage,
  Notification: Notification,
  Vehicles: {
    Makes: _objectSpread({}, VehiclesMakesModels),
    Models: _objectSpread({}, VehiclesModelModels)
  }
};