"use strict";

var express = require('express');

var router = express.Router();

var cors = require('cors');

var rolesMiddleware = require('../middlewares/roles.middleware');

var corsMiddleware = require('../middlewares/cors.middleware');

var passportMiddleware = require('../middlewares/passport');

var vehicleController = require('../controllers/vehicles.controller'); //admin only


router.options('/:vehicleType/makes', cors(corsMiddleware.authedCors)); // enable pre-flights

router.post('/:vehicleType/makes', corsMiddleware.manualCors, passportMiddleware.authenticate('cookie', {
  session: false
}), rolesMiddleware.grantAccess('updateAny', 'make'), vehicleController.createMakes); //admin only

router.options('/:type/makes', cors(corsMiddleware.authedCors)); // enable pre-flights

router.put('/:type/makes', corsMiddleware.manualCors, passportMiddleware.authenticate('cookie', {
  session: false
}), rolesMiddleware.grantAccess('updateAny', 'make'), vehicleController.updateMakes); //admin only

router.options('/dyn/:vehicleType/models', cors(corsMiddleware.authedCors)); // enable pre-flights

router.post('/dyn/:vehicleType/models', corsMiddleware.manualCors, passportMiddleware.authenticate('cookie', {
  session: false
}), rolesMiddleware.grantAccess('updateAny', 'make'), vehicleController.createModels); // type : ["cars", "buses", "scooters", "campers", "motorcycles", "trucks"];

router.get('/dyn/:vehicleType/makes', corsMiddleware.manualCors, vehicleController.getVehicleTypeMakes); //query : { make : String }

router.get('/dyn/:vehicleType/models', corsMiddleware.manualCors, vehicleController.getVehicleTypeMakeModels); //query : { make : String }

router.get('/cars/distinct/make/models', corsMiddleware.manualCors, vehicleController.getCarsMakeModels); //query : { make : String, model : String }

router.get('/cars/distinct/make/model/trims', corsMiddleware.manualCors, vehicleController.getCarsMakeModelTrims); //query : { make : String, model : String, (trim : String) }

router.get('/cars/make/model/trim/years', corsMiddleware.manualCors, vehicleController.getCarsMakeModelTrimYears);
module.exports = router;