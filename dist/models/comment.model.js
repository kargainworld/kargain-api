"use strict";

var mongoose = require('mongoose');

var AnswerSchema = require('../schemas/comments/response.schema');

var LikeSchema = require('../schemas/like.schema');

var CommentSchema = new mongoose.Schema({
  announce: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Announce'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // autopopulate: true

  },
  message: {
    type: String,
    trim: true
  },
  enabled: {
    type: Boolean,
    "default": true
  },
  responses: [AnswerSchema],
  likes: [LikeSchema],
  complaints: {
    type: Boolean,
    "default": false
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  strict: false
});
CommentSchema.virtual('id').get(function () {
  var user = this;
  return user._id;
});
CommentSchema.plugin(require('mongoose-autopopulate')); // Export mongoose model

module.exports = mongoose.model('Comment', CommentSchema);