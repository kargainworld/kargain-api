"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ = require('lodash');

var mongoose = require('mongoose');

var slugify = require('@sindresorhus/slugify');

var Errors = require('../utils/errors');

var Messages = require('../utils/messages');

var redisConfig = require('../services/redis');

var redisClient = redisConfig.redisClient; // const fs = require('fs')
// const path = require('path')
// const { promisify } = require("util")
// const readFileAsync = promisify(fs.readFile)
// const writeFileAsync = promisify(fs.writeFile)
// const htmlDir = "C:\\Users\\Niko_PC\\Downloads\\cars\\json"
// const debugDir = "C:\\Users\\Niko_PC\\Downloads\\cars"

var asyncFilter = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(arr, predicate) {
    var results;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return Promise.all(arr.map(predicate));

          case 2:
            results = _context.sent;
            return _context.abrupt("return", arr.filter(function (_v, index) {
              return results[index];
            }));

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function asyncFilter(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); // exports.bulkCars = async (req, res, next) => {
//     const files = fs.readdirSync(htmlDir);
//     const modelMake = require('../../models').Vehicles.Makes["cars"]
//     const modelModel = require('../../models').Vehicles.Models["cars"]
//     if (!modelMake) throw 'missing model'
//     if (!modelModel) throw 'missing model'
//
//     let makes = 0
//     let models = 0
//     let start = new Date()
//
//     const asyncForEach = async (array, callback) => {
//         for (let index = 0; index < array.length; index++) {
//             await callback(array[index], index, array)
//         }
//     }
//     try{
//         await asyncForEach(files, async (file) => {
//             const filePath = path.resolve(`${htmlDir}\\${file}`);
//             const doc = await readFileAsync(filePath, 'utf8');
//             const json = JSON.parse(doc);
//
//             await asyncForEach(json, async (row) => {
//                 const {
//                     make,
//                     make_id,
//                     make_ru,
//                     ...rest
//                 } = row
//
//                 let makeId;
//                 const match = await modelMake.findOne({ make })
//
//                 if (!match) {
//                     const docMake = new modelMake({
//                         make,
//                         make_id,
//                         make_ru
//                     })
//                     await docMake.save()
//                     makeId = docMake._id
//                     makes += 1
//                 } else makeId = match._id
//
//                 const { trim_ru, model, generation, drive, engine_type } = rest
//                 const matchModel = await modelModel.findOne({
//                     trim_ru,
//                     model,
//                     generation,
//                     drive,
//                     engine_type
//                 })
//
//                 if(!matchModel){
//                     const docModel = new modelModel({
//                         ...rest,
//                         make_id  : makeId
//                     })
//                     const doc = await docModel.save()
//                     console.log(doc)
//                     models += 1
//                 }
//             })
//         })
//
//         let end = (new Date() - start)/1000/60/60;
//         console.log("end process")
//
//         return res.json({
//             makes,
//             models,
//             log : `Execution time: ${end} hours`
//         })
//     }catch (err){
//         const time = Date.now()
//         await writeFileAsync(debugDir + "/" + `debug_${time}.log`, JSON.stringify(err), "utf8");
//     }
// }


exports.createMakes = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var vehicleType, modelMake, entries;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            vehicleType = req.params.vehicleType;
            modelMake = require('../models').Vehicles.Makes[vehicleType];

            if (modelMake) {
              _context3.next = 4;
              break;
            }

            return _context3.abrupt("return", next('missing model'));

          case 4:
            _context3.next = 6;
            return asyncFilter(req.body, /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(entry) {
                var match;
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return modelMake.findOne({
                          make: entry.make
                        });

                      case 2:
                        match = _context2.sent;

                        if (!match) {
                          _context2.next = 7;
                          break;
                        }

                        match.make_id = entry.make_id;
                        _context2.next = 7;
                        return match.save();

                      case 7:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x6) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 6:
            entries = _context3.sent;
            return _context3.abrupt("return", res.json({
              success: true,
              count: entries.length,
              entries: entries
            }));

          case 8:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

exports.updateMakes = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var vehicleType, modelMake, makes, entries;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            vehicleType = req.params.vehicleType;
            modelMake = require('../models').Vehicles.Makes[vehicleType];

            if (modelMake) {
              _context5.next = 4;
              break;
            }

            return _context5.abrupt("return", next('missing model'));

          case 4:
            _context5.next = 6;
            return modelMake.find({});

          case 6:
            makes = _context5.sent;
            _context5.prev = 7;
            _context5.next = 10;
            return makes.reduce( /*#__PURE__*/function () {
              var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(accPromise, doc) {
                var acc, updated;
                return _regenerator["default"].wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return accPromise;

                      case 2:
                        acc = _context4.sent;
                        _context4.next = 5;
                        return modelMake.updateOne({
                          _id: doc._id
                        }, {
                          '$set': {
                            // "make_id": Number(doc.make_id),
                            'make_slug': slugify(doc.make)
                          } // "$unset" : {
                          //     "make_idd" : 1
                          // }

                        });

                      case 5:
                        updated = _context4.sent;
                        return _context4.abrupt("return", [].concat((0, _toConsumableArray2["default"])(acc), [updated]));

                      case 7:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));

              return function (_x10, _x11) {
                return _ref5.apply(this, arguments);
              };
            }(), Promise.resolve([]));

          case 10:
            entries = _context5.sent;
            return _context5.abrupt("return", res.json({
              success: true,
              entries: entries
            }));

          case 14:
            _context5.prev = 14;
            _context5.t0 = _context5["catch"](7);
            return _context5.abrupt("return", next(_context5.t0));

          case 17:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[7, 14]]);
  }));

  return function (_x7, _x8, _x9) {
    return _ref4.apply(this, arguments);
  };
}();

exports.createModels = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var vehicleType, modelModel, makeModel, entries;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            vehicleType = req.params.type;
            modelModel = require('../models').Vehicles.Models[vehicleType];
            makeModel = require('../models').Vehicles.Makes[vehicleType];

            if (modelModel) {
              _context7.next = 5;
              break;
            }

            return _context7.abrupt("return", next('missing model'));

          case 5:
            if (makeModel) {
              _context7.next = 7;
              break;
            }

            return _context7.abrupt("return", next('missing model'));

          case 7:
            _context7.next = 9;
            return req.body.reduce( /*#__PURE__*/function () {
              var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(accPromise, entry) {
                var acc, model, make_id, model_id, model_ru, makeMatch, matchModel, newModel, doc;
                return _regenerator["default"].wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.next = 2;
                        return accPromise;

                      case 2:
                        acc = _context6.sent;
                        model = entry.model, make_id = entry.make_id, model_id = entry.model_id, model_ru = entry.model_ru;
                        _context6.next = 6;
                        return makeModel.findOne({
                          _id: make_id
                        });

                      case 6:
                        makeMatch = _context6.sent;
                        _context6.next = 9;
                        return modelModel.findOne({
                          model: model
                        });

                      case 9:
                        matchModel = _context6.sent;

                        if (!(!matchModel && makeMatch)) {
                          _context6.next = 18;
                          break;
                        }

                        newModel = new modelModel({
                          model: model,
                          make_id: makeMatch._id,
                          model_id: model_id,
                          model_ru: model_ru
                        });
                        _context6.next = 14;
                        return newModel.save();

                      case 14:
                        doc = _context6.sent;
                        return _context6.abrupt("return", [].concat((0, _toConsumableArray2["default"])(acc), [doc]));

                      case 18:
                        return _context6.abrupt("return", [].concat((0, _toConsumableArray2["default"])(acc), [{
                          makeMatch: makeMatch,
                          matchModel: matchModel
                        }]));

                      case 19:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6);
              }));

              return function (_x15, _x16) {
                return _ref7.apply(this, arguments);
              };
            }(), Promise.resolve([]));

          case 9:
            entries = _context7.sent;
            return _context7.abrupt("return", res.json({
              success: true,
              count: entries.length,
              entries: entries
            }));

          case 11:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function (_x12, _x13, _x14) {
    return _ref6.apply(this, arguments);
  };
}();

exports.getVehicleTypeMakes = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    var vehicleType, forceRewriteCache, filter, query, cacheKey, cache, makeModel, makes;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            vehicleType = req.params.vehicleType;
            forceRewriteCache = Boolean(req.query.forceRewriteCache);
            filter = req.query.filter;
            query = filter ? {
              make: {
                $in: filter.split(',')
              }
            } : {};
            _context8.prev = 4;
            cacheKey = "".concat(vehicleType, "_makes");
            _context8.next = 8;
            return redisConfig.getCacheKey(cacheKey);

          case 8:
            cache = _context8.sent;

            if (!(cache && !forceRewriteCache)) {
              _context8.next = 11;
              break;
            }

            return _context8.abrupt("return", res.json({
              success: true,
              msg: 'from redis',
              hostname: redisClient.address,
              data: cache
            }));

          case 11:
            makeModel = require('../models').Vehicles.Makes[vehicleType];

            if (makeModel) {
              _context8.next = 14;
              break;
            }

            return _context8.abrupt("return", next(Errors.NotFoundError(Messages.errors.missing_vehicle_make)));

          case 14:
            _context8.next = 16;
            return makeModel.find(query);

          case 16:
            makes = _context8.sent;
            redisClient.set(cacheKey, JSON.stringify(makes));
            return _context8.abrupt("return", res.json({
              success: true,
              msg: 'from db',
              data: makes
            }));

          case 21:
            _context8.prev = 21;
            _context8.t0 = _context8["catch"](4);
            return _context8.abrupt("return", next(_context8.t0));

          case 24:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[4, 21]]);
  }));

  return function (_x17, _x18, _x19) {
    return _ref8.apply(this, arguments);
  };
}();

exports.getVehicleTypeMakeModels = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res, next) {
    var make, vehicleType, forceRewriteCache, cacheKey, cache, vehicleMakeModel, vehicleModelsModel, makeDoc, models;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            make = req.query.make;
            vehicleType = req.params.vehicleType;
            forceRewriteCache = Boolean(req.query.forceRewriteCache);

            if (make) {
              _context9.next = 5;
              break;
            }

            return _context9.abrupt("return", next(Errors.NotFoundError(Messages.errors.missing_vehicle_make)));

          case 5:
            _context9.prev = 5;
            cacheKey = "".concat(vehicleType, "_").concat(make, "_models");
            _context9.next = 9;
            return redisConfig.getCacheKey(cacheKey);

          case 9:
            cache = _context9.sent;

            if (!(cache && !forceRewriteCache)) {
              _context9.next = 12;
              break;
            }

            return _context9.abrupt("return", res.json({
              success: true,
              msg: 'from redis',
              hostname: redisClient.address,
              data: cache
            }));

          case 12:
            vehicleMakeModel = require('../models').Vehicles.Makes[vehicleType];
            vehicleModelsModel = require('../models').Vehicles.Models[vehicleType];

            if (!(!vehicleMakeModel || !vehicleModelsModel)) {
              _context9.next = 16;
              break;
            }

            return _context9.abrupt("return", next(Errors.NotFoundError(Messages.errors.missing_vehicle_model)));

          case 16:
            _context9.next = 18;
            return vehicleMakeModel.findOne({
              make_slug: slugify(make)
            });

          case 18:
            makeDoc = _context9.sent;
            _context9.next = 21;
            return vehicleModelsModel.find({
              make_id: mongoose.Types.ObjectId(makeDoc._id)
            });

          case 21:
            models = _context9.sent;
            redisClient.set(cacheKey, JSON.stringify(models));
            return _context9.abrupt("return", res.json({
              success: true,
              msg: 'from db',
              data: models
            }));

          case 26:
            _context9.prev = 26;
            _context9.t0 = _context9["catch"](5);
            return _context9.abrupt("return", next(_context9.t0));

          case 29:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[5, 26]]);
  }));

  return function (_x20, _x21, _x22) {
    return _ref9.apply(this, arguments);
  };
}();

exports.getCarsMakeModels = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res, next) {
    var make, carsMakesModel, forceRewriteCache, cacheKey, cache, makeDoc, db, aggregateModels;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            make = req.query.make;
            carsMakesModel = require('../models').Vehicles.Makes['cars'];
            forceRewriteCache = Boolean(req.query.forceRewriteCache);
            cacheKey = "cars_".concat(make);

            if (make) {
              _context10.next = 6;
              break;
            }

            return _context10.abrupt("return", next(Errors.NotFoundError(Messages.errors.missing_vehicle_make)));

          case 6:
            _context10.prev = 6;
            _context10.next = 9;
            return redisConfig.getCacheKey(cacheKey);

          case 9:
            cache = _context10.sent;

            if (!(cache && !(cache instanceof Array) && !forceRewriteCache)) {
              _context10.next = 12;
              break;
            }

            return _context10.abrupt("return", res.json({
              success: true,
              msg: 'from redis',
              hostname: redisClient.address,
              data: cache
            }));

          case 12:
            _context10.next = 14;
            return carsMakesModel.findOne({
              make_slug: slugify(make)
            });

          case 14:
            makeDoc = _context10.sent;

            if (makeDoc) {
              _context10.next = 17;
              break;
            }

            return _context10.abrupt("return", next(Errors.NotFoundError(Messages.errors.missing_vehicle_make)));

          case 17:
            db = mongoose.connection;
            _context10.next = 20;
            return db.db.command({
              distinct: 'cars_models',
              key: 'model',
              query: {
                make_id: mongoose.Types.ObjectId(makeDoc._id)
              }
            });

          case 20:
            aggregateModels = _context10.sent;
            redisClient.set(cacheKey, JSON.stringify(aggregateModels));
            return _context10.abrupt("return", res.json({
              success: true,
              data: aggregateModels.values
            }));

          case 25:
            _context10.prev = 25;
            _context10.t0 = _context10["catch"](6);
            return _context10.abrupt("return", next(_context10.t0));

          case 28:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[6, 25]]);
  }));

  return function (_x23, _x24, _x25) {
    return _ref10.apply(this, arguments);
  };
}();

exports.getCarsMakeModelTrims = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
    var _req$query, make, model, carsMakesModel, forceRewriteCache, cacheKey, cache, makeDoc, db, aggregateTrims;

    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _req$query = req.query, make = _req$query.make, model = _req$query.model;

            if (make) {
              _context11.next = 3;
              break;
            }

            return _context11.abrupt("return", next(Errors.NotFoundError(Messages.errors.missing_vehicle_make)));

          case 3:
            if (model) {
              _context11.next = 5;
              break;
            }

            return _context11.abrupt("return", next(Errors.NotFoundError(Messages.errors.missing_vehicle_model)));

          case 5:
            carsMakesModel = require('../models').Vehicles.Makes['cars'];
            forceRewriteCache = Boolean(req.query.forceRewriteCache);
            _context11.prev = 7;
            cacheKey = "cars_".concat(make, "_").concat(model, "_trims");
            _context11.next = 11;
            return redisConfig.getCacheKey(cacheKey);

          case 11:
            cache = _context11.sent;

            if (!(cache && !(cache instanceof Array) && !forceRewriteCache)) {
              _context11.next = 14;
              break;
            }

            return _context11.abrupt("return", res.json({
              success: true,
              msg: 'from redis',
              hostname: redisClient.address,
              data: cache
            }));

          case 14:
            _context11.next = 16;
            return carsMakesModel.findOne({
              make_slug: slugify(make)
            });

          case 16:
            makeDoc = _context11.sent;

            if (!makeDoc) {
              next(Errors.Error(Messages.errors.missing_vehicle_make));
            }

            db = mongoose.connection;
            _context11.next = 21;
            return db.db.command({
              distinct: 'cars_models',
              key: 'trim',
              query: {
                make_id: mongoose.Types.ObjectId(makeDoc._id),
                model: model
              }
            });

          case 21:
            aggregateTrims = _context11.sent;
            return _context11.abrupt("return", res.json({
              success: true,
              data: aggregateTrims.values
            }));

          case 25:
            _context11.prev = 25;
            _context11.t0 = _context11["catch"](7);
            return _context11.abrupt("return", next(_context11.t0));

          case 28:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[7, 25]]);
  }));

  return function (_x26, _x27, _x28) {
    return _ref11.apply(this, arguments);
  };
}();

exports.getCarsMakeModelTrimYears = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res, next) {
    var _req$query2, make, model, trim, carsMakesModel, carsModelsModel, forceRewriteCache, cacheKey, cache, makeDoc, query, trimsYears, fromDoc;

    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _req$query2 = req.query, make = _req$query2.make, model = _req$query2.model, trim = _req$query2.trim;

            if (make) {
              _context12.next = 3;
              break;
            }

            return _context12.abrupt("return", next(Errors.NotFoundError(Messages.errors.missing_vehicle_make)));

          case 3:
            if (model) {
              _context12.next = 5;
              break;
            }

            return _context12.abrupt("return", next(Errors.NotFoundError(Messages.errors.missing_vehicle_model)));

          case 5:
            carsMakesModel = require('../models').Vehicles.Makes['cars'];
            carsModelsModel = require('../models').Vehicles.Models['cars'];
            forceRewriteCache = Boolean(req.query.forceRewriteCache);
            _context12.prev = 8;
            cacheKey = trim ? "cars_".concat(make, "_").concat(model, "_").concat(trim, "_years") : "cars_".concat(make, "_").concat(model, "_years");
            _context12.next = 12;
            return redisConfig.getCacheKey(cacheKey);

          case 12:
            cache = _context12.sent;

            if (!(cache && !forceRewriteCache)) {
              _context12.next = 15;
              break;
            }

            return _context12.abrupt("return", res.json({
              success: true,
              msg: 'from redis',
              hostname: redisClient.address,
              data: cache
            }));

          case 15:
            _context12.next = 17;
            return carsMakesModel.findOne({
              make_slug: slugify(make)
            });

          case 17:
            makeDoc = _context12.sent;

            if (!makeDoc) {
              next(Errors.Error(Messages.errors.missing_vehicle_make));
            }

            query = {
              make_id: mongoose.Types.ObjectId(makeDoc._id),
              model: model
            };

            if (trim) {
              query.trim = trim;
            }

            _context12.next = 23;
            return carsModelsModel.find(query, {
              year: 1
            });

          case 23:
            trimsYears = _context12.sent;

            fromDoc = function fromDoc(key) {
              return function (doc) {
                return doc.toObject()[key];
              };
            };

            return _context12.abrupt("return", res.json({
              success: true,
              query: query,
              data: _.sortBy(_.uniqBy(trimsYears, fromDoc('year')), fromDoc('year'))
            }));

          case 28:
            _context12.prev = 28;
            _context12.t0 = _context12["catch"](8);
            return _context12.abrupt("return", next(_context12.t0));

          case 31:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[8, 28]]);
  }));

  return function (_x29, _x30, _x31) {
    return _ref12.apply(this, arguments);
  };
}();