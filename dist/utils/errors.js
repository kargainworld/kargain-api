"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var CustomError = /*#__PURE__*/function (_Error) {
  (0, _inherits2["default"])(CustomError, _Error);

  var _super = _createSuper(CustomError);

  function CustomError(err, name) {
    var _this;

    var code = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;
    (0, _classCallCheck2["default"])(this, CustomError);
    _this = _super.call(this);
    _this.message = err instanceof Error ? err.message : err;
    _this.statusCode = code;
    _this.name = name || _this.constructor.name;
    Error.captureStackTrace((0, _assertThisInitialized2["default"])(_this), CustomError);
    return _this;
  }

  return CustomError;
}( /*#__PURE__*/(0, _wrapNativeSuper2["default"])(Error));

module.exports = {
  Error: function Error(message) {
    return new CustomError(message, 'Error', 400);
  },
  AnonymousError: function AnonymousError(message, name, code) {
    return new CustomError(message, name, code);
  },
  AlreadyActivated: function AlreadyActivated(message) {
    return new CustomError(message, 'AlreadyActivatedError', 201);
  },
  DuplicateError: function DuplicateError(message) {
    return new CustomError(message, 'DuplicateError', 205);
  },
  ExpiredTokenError: function ExpiredTokenError(message) {
    return new CustomError(message, 'ExpiredTokenError', 401);
  },
  UnAuthorizedError: function UnAuthorizedError(message) {
    return new CustomError(message, 'UnAuthorizedError', 403);
  },
  NotFoundError: function NotFoundError(message) {
    return new CustomError(message, 'NotFoundError', 404);
  }
};