"use strict";

var AuthMailer = require('./auth');

var AnnouncesMailer = require('./announces');

var UsersMailer = require('./users');

module.exports = {
  auth: AuthMailer,
  announces: AnnouncesMailer,
  users: UsersMailer
};