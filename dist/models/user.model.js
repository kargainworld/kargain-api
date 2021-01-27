"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var mongoose = require('mongoose');

var bcrypt = require('bcryptjs');

var crypto = require('crypto');

var _require = require('uuidv4'),
    uuid = _require.uuid;

var utils = require('../utils/helpers');

var Errors = require('../utils/errors');

var LikeSchema = require('../schemas/like.schema');

var UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
    get: function get(v) {
      return utils.capitalizeWords(v);
    }
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    get: function get(v) {
      return utils.capitalizeWords(v);
    }
  },
  //generated
  username: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    trim: true,
    required: true
  },
  salt: String,
  pass_reset: String,
  removed: {
    type: Boolean,
    "default": false
  },
  activated: {
    type: Boolean,
    "default": false
  },
  email_validated: {
    type: Boolean,
    "default": false
  },
  role: {
    type: String,
    "enum": ['basic', 'admin'],
    "default": 'basic'
  },
  pro: {
    type: Boolean,
    "default": false
  },
  //pro features
  company: {
    name: String,
    siren: String,
    owner: String
  },
  phone: {
    type: String,
    trim: true
  },
  //STRIPE
  subscriptionLog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    autopopulate: true
  },
  subscriptionOfferTitle: String,
  hasProPlan: {
    type: Boolean,
    "default": false
  },
  about: {
    type: String,
    trim: true
  },
  location: {
    coordinates: {
      type: [Number],
      "default": [0, 0] //long, lat

    },
    type: {
      type: String,
      "enum": ['Point'],
      "default": 'Point'
    }
  },
  countrySelect: {
    label: String,
    value: String
  },
  address: {
    housenumber: Number,
    street: {
      type: String,
      trim: true
    },
    postCode: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    fullAddress: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    }
  },
  avatar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media',
    autopopulate: true
  },
  avatarUrl: String,
  garage: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Announce'
  }],
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Announce'
  }],
  followers: [LikeSchema],
  followings: [LikeSchema],
  sso: Boolean,
  facebookProvider: {
    type: {
      id: String,
      token: String
    },
    select: false
  }
}, {
  timestamps: true,
  strict: false,
  toObject: {
    virtuals: true,
    transform: function transform(doc, ret) {}
  },
  toJSON: {
    virtuals: true,
    transform: function transform(doc, ret) {
      delete ret.pro;
      delete ret.password;
    }
  }
});
UserSchema.index({
  '$**': 'text'
});
UserSchema.plugin(require('mongoose-autopopulate'));
UserSchema.post('init', function (doc) {
  console.log('%s has been initialized from the db', doc._id);
});
UserSchema.post('remove', function (doc) {
  console.log('%s has been removed', doc._id);
}); // hashing a password before saving it to the database

UserSchema.pre('save', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(next) {
    var user, fullname, md5;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            user = this;
            _context.prev = 1;

            if (!this.isNew) {
              _context.next = 8;
              break;
            }

            fullname = utils.stringToSlug("".concat(user.firstname, " ").concat(user.lastname));
            user.username = "".concat(fullname, "-").concat(uuid().substr(0, 6));
            _context.next = 7;
            return hashPassword(user.password);

          case 7:
            user.password = _context.sent;

          case 8:
            if (!user.avatarUrl) {
              md5 = crypto.createHash('md5').update(this.email).digest('hex');
              user.avatarUrl = 'https://gravatar.com/avatar/' + md5 + '?s=64&d=wavatar';
            }

            next();
            _context.next = 15;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](1);
            next(_context.t0);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 12]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
UserSchema.post('save', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(err, doc, next) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!err) {
              _context2.next = 6;
              break;
            }

            if (!(err.name === 'MongoError' && err.code === 11000)) {
              _context2.next = 5;
              break;
            }

            return _context2.abrupt("return", next(Errors.DuplicateError('duplicate user')));

          case 5:
            return _context2.abrupt("return", next(err));

          case 6:
            next();

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());

UserSchema.statics.hashPassword = function (password, salt) {
  return hashPassword(password, salt);
};

var hashPassword = function hashPassword(password) {
  var saltRounds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
  return bcrypt.hash(password, saltRounds);
};

UserSchema.statics.findByEmail = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(email) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return this.model('User').findOne({
              email: email
            }).exec();

          case 2:
            return _context3.abrupt("return", _context3.sent);

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function (_x5) {
    return _ref3.apply(this, arguments);
  };
}();

UserSchema.statics.confirmUserEmail = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(email) {
    var user;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return this.model('User').findOne({
              email: email
            }).exec();

          case 2:
            user = _context4.sent;

            if (user) {
              _context4.next = 5;
              break;
            }

            throw new Error('user not found');

          case 5:
            // if (user.activated && user.email_validated) { throw new Error('user already activated') }
            user.activated = true;
            user.email_validated = true;
            _context4.next = 9;
            return user.save();

          case 9:
            return _context4.abrupt("return", _context4.sent);

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function (_x6) {
    return _ref4.apply(this, arguments);
  };
}();

UserSchema.statics.resetPassword = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(email, password) {
    var user, areIdentical;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return this.model('User').findByEmail(email);

          case 2:
            user = _context5.sent;
            _context5.next = 5;
            return user.comparePassword(password);

          case 5:
            areIdentical = _context5.sent;

            if (!areIdentical) {
              _context5.next = 8;
              break;
            }

            throw new Error('Password are identical');

          case 8:
            _context5.next = 10;
            return hashPassword(password);

          case 10:
            user.password = _context5.sent;
            _context5.next = 13;
            return user.save();

          case 13:
            return _context5.abrupt("return", _context5.sent);

          case 14:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function (_x7, _x8) {
    return _ref5.apply(this, arguments);
  };
}();

UserSchema.methods.comparePassword = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(password) {
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return bcrypt.compare(password, this.password);

          case 2:
            return _context6.abrupt("return", _context6.sent);

          case 3:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function (_x9) {
    return _ref6.apply(this, arguments);
  };
}();

UserSchema.virtual('id').get(function () {
  var user = this;
  return user._id;
});
UserSchema.virtual('isPro').get(function () {
  var user = this;
  return user.pro === true;
});
UserSchema.virtual('config').get(function () {
  var user = this;
  return {
    garageLengthAllowed: user.pro ? 100 : 5
  };
}); //TODO refacto w permissions

UserSchema.virtual('isAdmin').get(function () {
  var user = this;
  return user.role === 'admin';
});
UserSchema.virtual('fullname').get(function () {
  var user = this;
  return "".concat(user.firstname, " ").concat(user.lastname);
}); // UserSchema.methods.garageVirtual = async function () {
//     return await this.model('Announce').find({ user : mongoose.Types.ObjectId(this.id)})
// }
// Export mongoose model

module.exports = mongoose.model('User', UserSchema);