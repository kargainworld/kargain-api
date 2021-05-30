"use strict";

var confirmAccount = require('./confirm-email');

var resetPassword = require('./reset-password');

module.exports = {
  confirmAccount: confirmAccount,
  resetPassword: resetPassword
};