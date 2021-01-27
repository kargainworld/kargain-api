"use strict";

var mongoose = require('mongoose');

var Errors = require('../../utils/errors');

var Messages = require('../../utils/messages');

var notificationModel = require('../../models').Notification;

var postNotification = function postNotification(_ref) {
  var uid = _ref.uid,
      message = _ref.message,
      action = _ref.action;
  return new Promise(function (resolve, reject) {
    if (!uid) {
      reject(Errors.NotFoundError(Messages.errors.missing_or_invalid_email));
    }

    if (!message) {
      reject(Errors.NotFoundError('missing firstname'));
    }

    var result = notificationModel.updateMany({
      to: mongoose.Types.ObjectId(uid)
    }, {
      $addToSet: {
        pings: {
          message: message,
          action: action
        }
      }
    }, {
      runValidators: true
    });
    return resolve(result);
  });
};

module.exports = {
  postNotification: postNotification
};