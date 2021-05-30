"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var fetch = require('node-fetch');

var querystring = require('querystring');

function stringToSlug(str) {
  var v = str.replace(/^\s+|\s+$/g, '').toLowerCase(); // remove accents, swap ñ for n, etc

  var from = 'àáãäâèéëêìíïîòóöôùúüûñç·/_,:;';
  var to = 'aaaaaeeeeiiiioooouuuunc------';
  return from.split('').reduce(function (carry, c, i) {
    return carry.replace(new RegExp(c, 'g'), to.charAt(i));
  }, v).replace(/[^a-z0-9 -]/g, '') // remove invalid chars
  .replace(/\s+/g, '-') // collapse whitespace and replace by -
  .replace(/-+/g, '-'); // collapse dashes
}

var resolveObjectKey = function resolveObjectKey(obj, str) {
  if (!str) {
    return obj;
  }

  if ((0, _typeof2["default"])(obj) === 'object') {
    str = str.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties

    str = str.replace(/^\./, ''); // strip a leading dot

    var a = str.split('.');

    for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i];

      if (!obj) {
        return;
      }

      if (k in obj) {
        obj = obj[k];
      } else {
        return;
      }
    }
  }

  return obj;
};

var fetchExternalApi = function fetchExternalApi(url) {
  var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return fetch(url, {
    headers: headers
  }).then(function (response) {
    return response.json();
  })["catch"](function (err) {
    throw err;
  });
};

var capitalizeWords = function capitalizeWords(str) {
  if (!str) {
    return;
  }

  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

var buildUrl = function buildUrl(baseUrl, params) {
  return Object.keys(params).length ? "".concat(baseUrl, "?").concat(querystring.stringify(params)) : baseUrl;
};

module.exports = {
  stringToSlug: stringToSlug,
  resolveObjectKey: resolveObjectKey,
  fetchExternalApi: fetchExternalApi,
  buildUrl: buildUrl,
  capitalizeWords: capitalizeWords
};