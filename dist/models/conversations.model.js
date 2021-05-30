"use strict";

var mongoose = require('mongoose');

var messageModel = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  content: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});
var conversationModel = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [messageModel]
}, {
  timestamps: true
}); // Export mongoose model

module.exports = mongoose.model('Conversation', conversationModel);