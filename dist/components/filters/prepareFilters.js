"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var announcesFiltersMapper = require('./announcesFiltersMapper');

var buildFilters = function buildFilters(query) {
  return Object.keys(announcesFiltersMapper).reduce(function (carry, key) {
    var match = Object.keys(query).find(function (prop) {
      return prop === key;
    });

    if (match) {
      return _objectSpread(_objectSpread({}, carry), {}, (0, _defineProperty2["default"])({}, key, _objectSpread(_objectSpread({}, announcesFiltersMapper[key]), {}, {
        value: query[key]
      })));
    } else {
      return carry;
    }
  }, {});
};

var prepareFilters = function prepareFilters(query, defaultQuery) {
  var filters = buildFilters(query);
  var result = Object.keys(filters).reduce(function (carry, key) {
    var filter = filters[key];

    if ((0, _typeof2["default"])(filter) === 'object') {
      if (!carry[filter.ref]) {
        carry[filter.ref] = {};
      }

      if (filter.type === 'range') {
        var values = filter.value.split(',');
        var min = Number(values[0]);
        var max = Number(values[1]);

        if (!filter.disable) {
          if (min) {
            carry[filter.ref]['$gte'] = min;
          }

          if (max) {
            if (filter.maxDisable && max < filter.maxDisable) {
              carry[filter.ref]['$lte'] = max;
            } else {
              carry[filter.ref]['$lte'] = max;
            }
          }
        }
      } else if (filter.type === 'number') {
        if (filter.rule === 'max') {
          carry[filter.ref]['$gte'] = Number(filter.value);
        } else if (filter.rule === 'strict') {
          Number(filter.value);
        } //default behaviour = under maximum default value allowed
        else {
            carry[filter.ref]['$lte'] = Number(filter.value);
          }
      } else if (filter.type === 'array') {
        carry[filter.ref] = {
          $in: filter.value.split(',').map(function (v) {
            return filter.number ? Number(v) : v;
          })
        };
      } else {
        if (filter.rule === 'strict') {
          carry[filter.ref] = filter.value.toLowerCase();
        } else {
          carry[filter.ref] = {
            $regex: filter.value,
            $options: 'i'
          };
        }
      }
    }

    return carry;
  }, defaultQuery);

  if (query.enableGeocoding && Array.isArray(query.coordinates) && query.radius) {
    result = _objectSpread(_objectSpread({}, result), {}, {
      'location': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [query.coordinates[0], query.coordinates[1]]
          },
          $maxDistance: query.radius * 1000
        }
      }
    });
  }

  return result;
};

module.exports = prepareFilters;