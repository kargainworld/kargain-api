"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var mongoose = require('mongoose');

var shortid = require('shortid');

var LikeSchema = require('./like.schema');

var utils = require('../utils/helpers');

var AnnounceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // autopopulate: { maxDepth: 1 }

  },
  title: {
    type: String,
    trim: true
  },
  showCellPhone: {
    type: Boolean,
    "default": true
  },
  //need admin validation
  activated: {
    type: Boolean,
    "default": false
  },
  //draft mode
  visible: {
    type: Boolean,
    "default": true
  },
  status: {
    type: String,
    "enum": ['rejected', 'deleted', 'archived', 'active'],
    "default": 'active'
  },
  description: {
    type: String,
    trim: true
  },
  expirationDate: {
    type: Date
  },
  slug: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    "default": 0,
    min: 0,
    max: 999999
  },
  vinNumber: String,
  adType: {
    type: String,
    required: true,
    "enum": ['sale', 'sale-pro', 'rent']
  },
  // car, moto etc ...
  vehicleType: {
    type: String,
    required: true,
    "enum": ['car', 'moto', 'bus', 'camper', 'utility']
  },
  // e:g moto => quad, scooter ...
  vehicleFunctionType: {
    label: String,
    value: String
  },
  // neuf, occas
  vehicleGeneralState: {
    label: String,
    value: String
  },
  // personal, taxi, driving-school ...
  vehicleFunctionUse: {
    label: String,
    value: String
  },
  // taxi, personal
  vehicleFunction: {
    label: String,
    value: String
  },
  vehicleEngineType: {
    label: String,
    value: String
  },
  vehicleEngineGas: {
    label: String,
    value: String
  },
  vehicleEngineCylinder: {
    type: Number,
    "default": 10,
    min: 10,
    max: 100000
  },
  makeRef: {
    type: String,
    required: true,
    "enum": ['buses_makes', 'campers_makes', 'cars_makes', 'motorcycles_makes', 'trucks_makes']
  },
  modelRef: {
    type: String,
    required: true,
    "enum": ['buses_models', 'campers_models', 'cars_models', 'motorcycles_models', 'trucks_models']
  },
  manufacturer: {
    make: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'makeRef',
      autopopulate: true
    },
    model: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'modelRef',
      autopopulate: true
    },
    generation: {
      label: String,
      value: String
    },
    year: {
      label: String,
      value: String
    }
  },
  mileage: {
    type: Number,
    "default": 0,
    min: 0,
    max: 999999
  },
  powerKm: {
    type: Number,
    "default": 0
  },
  powerCh: {
    type: Number,
    "default": 0
  },
  consumptionMixt: {
    type: Number,
    "default": 0
  },
  consumptionCity: {
    type: Number,
    "default": 0
  },
  consumptionRoad: {
    type: Number,
    "default": 0
  },
  consumptionGkm: {
    type: Number,
    "default": 0
  },
  equipments: [{
    _id: false,
    label: String,
    value: String
  }],
  ownersCount: {
    label: String,
    value: String
  },
  damages: [{
    _id: false,
    position: {
      left: Number,
      top: Number
    },
    text: {
      type: String,
      trim: true
    }
  }],
  doors: {
    label: String,
    value: String
  },
  seats: {
    label: String,
    value: String
  },
  //essieux (utility)
  axles: {
    label: String,
    value: String
  },
  driverCabins: {
    label: String,
    value: String
  },
  bunks: {
    label: String,
    value: String
  },
  beds: {
    label: String,
    value: String
  },
  bedType: {
    label: String,
    value: String
  },
  paint: {},
  materials: {},
  externalColor: {},
  internalColor: {},
  emission: {},
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
    }
  },
  images: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media',
    autopopulate: true
  }],
  tags: [{
    index: true,
    _id: false,
    type: String
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  likes: [LikeSchema]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  },
  strict: false
});
AnnounceSchema.path('tags').validate(function (arr) {
  return arr.length <= 10;
}, 'too much tags provided');
AnnounceSchema.index({
  '$**': 'text'
});
AnnounceSchema.index({
  location: '2dsphere'
}); // AnnounceSchema.plugin(require('mongoose-explain'));

AnnounceSchema.plugin(require('mongoose-autopopulate')); // hashing a password before saving it to the database

AnnounceSchema.pre('save', function (next) {
  if (this.isNew) {
    var _announce$adType, _announce$adType$valu, _announce$vehicleType, _announce$vehicleType2;

    var announce = this;
    var date = new Date();
    var adType = (_announce$adType = announce.adType) === null || _announce$adType === void 0 ? void 0 : (_announce$adType$valu = _announce$adType.value) === null || _announce$adType$valu === void 0 ? void 0 : _announce$adType$valu.toLowerCase();
    var vehicleType = (_announce$vehicleType = announce.vehicleType) === null || _announce$vehicleType === void 0 ? void 0 : (_announce$vehicleType2 = _announce$vehicleType.value) === null || _announce$vehicleType2 === void 0 ? void 0 : _announce$vehicleType2.toLowerCase();
    var titleParts = [adType, vehicleType, this.title, shortid.generate()].join(' ');
    this.slug = utils.stringToSlug(titleParts);
    this.expirationDate = new Date(date.setMonth(date.getMonth() + 1));
  }

  next();
});
AnnounceSchema.post('update', function () {
  console.log('Update finished.');
});

AnnounceSchema.statics.findByUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(uid) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return this.model('Announce').find({
              user: uid
            }).exec();

          case 2:
            return _context.abrupt("return", _context.sent);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

AnnounceSchema.virtual('id').get(function () {
  var announce = this;
  return announce._id;
});
AnnounceSchema.virtual('priceHT').get(function () {
  var announce = this;

  if (announce.price) {
    return Number(announce.price * 0.8).toFixed(0);
  }
});
module.exports = AnnounceSchema;