"use strict";

var mongoose = require('mongoose');

var contactMessage = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: true
  },
  subject: String,
  message: String
}, {
  timestamps: true
}); // Export mongoose model

module.exports = mongoose.model('Contact_message', contactMessage);