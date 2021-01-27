"use strict";

var mongoose = require('mongoose');

var TagSchema = new mongoose.Schema({
  name: String
}); // Export mongoose model

module.exports = mongoose.model('Tag', TagSchema);