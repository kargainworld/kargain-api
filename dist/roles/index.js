"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var AccessControl = require('accesscontrol').AccessControl;

var basicPermissions = require('./basicRoles');

var adminPermissions = require('./adminRoles');

var permissions = [].concat((0, _toConsumableArray2["default"])(basicPermissions), (0, _toConsumableArray2["default"])(adminPermissions));
var accessControlRoles = new AccessControl(permissions); // both admin and superadmin roles inherit moderator permissions

accessControlRoles.grant('superadmin').extend('admin');
exports.roles = accessControlRoles;