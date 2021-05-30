"use strict";

var vehicleSchema = require('../schemas/vehicles/vehicleModel.schema');

var mongoose = require('mongoose');

var bulkInsert = function bulkInsert(req, res, next) {
  var data = req.body;
  var vehicleType = req.params.vehicle;
  var vehicleTypeCapitalized = vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1);
  var model = mongoose.model(vehicleTypeCapitalized, vehicleSchema);
  model.insertMany(data).then(function (docs) {
    return res.json({
      success: true,
      msg: "".concat(docs.length, " inserted")
    });
  })["catch"](next);
};

module.exports = {
  bulkInsert: bulkInsert
};