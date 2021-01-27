"use strict";

var redisConfig = require('../services/redis');

var redisClient = redisConfig.redisClient;

var utils = require('../utils/helpers');

var CONFIG = require('../config');

var decodeFree = function decodeFree(req, res, next) {
  var BASE_API_URL = CONFIG.externalsAPI.vindecoderFree.API_URL;
  var vin = req.params.vin;
  var params = {
    format: 'json'
  };
  var url = utils.buildUrl("".concat(BASE_API_URL, "/").concat(vin), params);
  redisConfig.getCacheKey(url).then(function (data) {
    if (data) {
      return res.json({
        success: true,
        msg: 'from redis',
        from: url,
        hostname: redisClient.address,
        data: data
      });
    } else {
      utils.fetchExternalApi(url).then(function (result) {
        var data = result.Results[0];

        if (data) {
          redisClient.set(url, JSON.stringify(data));
          return res.json({
            success: true,
            msg: 'from API',
            from: url,
            data: data
          });
        } else {
          next('error while decoding VIN');
        }
      })["catch"](next);
    }
  });
};

var decode = function decode(req, res, next) {
  var BASE_API_URL = CONFIG.externalsAPI.vindecoder.API_URL;
  var AUTORIZATION_HEADER = CONFIG.externalsAPI.vindecoder.authorization;
  var PARTNER_TOKEN = CONFIG.externalsAPI.vindecoder['partner-token'];
  var headers = {// 'partner-token': PARTNER_TOKEN,
    // 'authorization': AUTORIZATION_HEADER
  };
  var params = {
    vin: req.params.vin
  };
  var url = utils.buildUrl("".concat(BASE_API_URL, "/decode"), params);
  redisConfig.getCacheKey(url).then(function (data) {
    if (data) {
      return res.json({
        success: true,
        msg: 'from redis',
        hostname: redisClient.address,
        data: data
      });
    } else {
      utils.fetchExternalApi(url, headers).then(function (data) {
        redisClient.set(url, JSON.stringify(data));
        return res.json({
          success: true,
          msg: 'from API',
          data: data
        });
      })["catch"](next);
    }
  });
};

var image = function image(req, res, next) {
  var BASE_API_URL = CONFIG.externalsAPI.vindecoder.API_URL;
  var AUTORIZATION_HEADER = CONFIG.externalsAPI.vindecoder.authorization;
  var PARTNER_TOKEN = CONFIG.externalsAPI.vindecoder['partner-token'];
  var headers = {// 'partner-token': PARTNER_TOKEN,
    // 'authorization': AUTORIZATION_HEADER
  };
  var params = {
    vin: req.params.vin
  };
  var url = utils.buildUrl("".concat(BASE_API_URL, "/image"), params);
  redisConfig.getCacheKey(url).then(function (data) {
    if (data) {
      return res.json({
        success: true,
        msg: 'from redis',
        hostname: redisClient.address,
        data: data
      });
    } else {
      utils.fetchExternalApi(url, headers).then(function (data) {
        redisClient.set(url, JSON.stringify(data));
        return res.json({
          success: true,
          msg: 'from API',
          data: data
        });
      })["catch"](next);
    }
  });
};

module.exports = {
  decode: decode,
  decodeFree: decodeFree,
  image: image
};