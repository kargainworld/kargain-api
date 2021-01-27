"use strict";

var utils = require('../utils/helpers');

var CONFIG = require('../config');

var fetchGouvAdressesAPI = function fetchGouvAdressesAPI(req, res, next) {
  var ADRESSE_API_URL = CONFIG.externalsAPI.geoGouv.adresse_API_URL;
  var url = utils.buildUrl(ADRESSE_API_URL, req.query);
  utils.fetchExternalApi(url).then(function (results) {
    return res.json({
      success: true,
      msg: "from ".concat(ADRESSE_API_URL),
      data: results
    });
  })["catch"](next);
};

var fetchVicopoAPI = function fetchVicopoAPI(req, res, next) {
  var API_URL = CONFIG.externalsAPI.vicopo.API_URL;
  var url = "".concat(API_URL, "/").concat(req.params.query);
  utils.fetchExternalApi(url).then(function (cities) {
    return res.json({
      success: true,
      msg: "from ".concat(API_URL),
      data: cities
    });
  })["catch"](next);
};

module.exports = {
  fetchGouvAdressesAPI: fetchGouvAdressesAPI,
  fetchVicopoAPI: fetchVicopoAPI
};