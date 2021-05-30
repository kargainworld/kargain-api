"use strict";

var router = require('express').Router();

var cors = require('cors');

var corsMiddleware = require('../middlewares/cors.middleware');

var authMiddleware = require('../middlewares/auth.middleware');

var searchController = require('../controllers/search.controller');

router.get('/', corsMiddleware.manualCors, authMiddleware.byPassAuth(), searchController.filterSearchAction());
module.exports = router;