"use strict";

var redis = require('redis');

var CONFIG = require('../config');

var redisClient = redis.createClient({
  port: CONFIG.redis.port,
  host: CONFIG.redis.host,
  password: CONFIG.redis.password,
  retry_strategy: function retry_strategy(options) {
    if (options.error.code === 'ECONNREFUSED') {
      // End reconnecting on a specific error and flush all commands with a individual error
      return new Error('The server refused the connection');
    }

    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands with a individual error
      return new Error('Retry time exhausted');
    }

    if (options.times_connected > 10) {
      // End reconnecting with built in error
      return undefined;
    } // reconnect after


    return Math.max(options.attempt * 100, 3000);
  }
});
setInterval(function () {
  console.log('redisClient => Sending Ping...');
  redisClient.ping();
}, 60000); // 60 seconds

redisClient.on('error', function (err) {
  throw err;
});

var getCacheKey = function getCacheKey(key) {
  return new Promise(function (resolve, reject) {
    redisClient.get(key, function (err, entry) {
      if (err) {
        throw err;
      }

      if (entry) {
        resolve(JSON.parse(entry));
      } else {
        resolve(null);
      }
    });
  });
};

var delCacheKey = function delCacheKey(key, cb) {
  redisClient.del(key, function (err, data) {
    return cb(err, data);
  });
};
/*
 * Calling unref() will allow this program to exit immediately after the get
 * command finishes. Otherwise the client would hang as long as the
 * client-server connection is alive.
 */


redisClient.unref();
module.exports = {
  redisClient: redisClient,
  getCacheKey: getCacheKey,
  delCacheKey: delCacheKey
};