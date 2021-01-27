"use strict";

var mongoose = require('mongoose');

var AnnounceSchema = require('../schemas/announce.schema');

var AnnounceModel = mongoose.model('Announce', AnnounceSchema);
AnnounceModel.on('index', function (err) {
  if (err) {
    console.log('error building indexes: ' + err);
  }
});
module.exports = AnnounceModel;