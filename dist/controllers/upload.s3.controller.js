"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var utilsS3 = require('../services/s3');

var _require = require('uuidv4'),
    uuid = _require.uuid;

var shortid = require('shortid');

var MediaModel = require('../models').Media;

function getWithoutExtension(filename) {
  return filename.split('.').slice(0, -1).join('.');
}

function getExtension(filename) {
  return filename.split('.').pop();
}

var getS3Config = function getS3Config(req, res, next) {
  try {
    var config = utilsS3.getConfig();
    res.json({
      success: true,
      data: {
        config: config
      }
    });
  } catch (err) {
    next(err);
  }
};

var postObjects = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var date, month, baseDir, typeDir, dir, enableHash, allowedFileNames, files;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            date = new Date();
            month = ('0' + (date.getMonth() + 1)).slice(-2);
            baseDir = req.body.baseDir || "uploads/".concat(date.getFullYear(), "/").concat(month);
            typeDir = req.body.typeDir;
            dir = typeDir ? "".concat(baseDir, "/").concat(typeDir) : "".concat(baseDir);
            enableHash = req.body.enableHash || true;
            allowedFileNames = ['images', 'avatar']; // see https://attacomsian.com/blog/uploading-files-nodejs-express

            if (req.files) {
              _context.next = 9;
              break;
            }

            return _context.abrupt("return", next());

          case 9:
            files = Object.keys(req.files).filter(function (key) {
              return allowedFileNames.includes(key);
            }).reduce(function (carry, key) {
              return _objectSpread(_objectSpread({}, carry), {}, (0, _defineProperty2["default"])({}, key, req.files[key]));
            }, {});
            _context.prev = 10;
            _context.next = 13;
            return pArray(files, enableHash, dir);

          case 13:
            req.uploadedFiles = _context.sent;
            return _context.abrupt("return", next());

          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](10);
            return _context.abrupt("return", next(_context.t0));

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[10, 17]]);
  }));

  return function postObjects(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var pArray = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(filesObj, enableHash, baseDir) {
    var filesKeys, uploads;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            filesKeys = Object.keys(filesObj);
            _context2.next = 3;
            return Promise.all(filesKeys.map(function (key) {
              var files = Array.isArray(filesObj[key]) ? filesObj[key] : [filesObj[key]];
              return Promise.all(files.map(function (image) {
                return uploadMedia(image, enableHash, baseDir);
              }));
            }));

          case 3:
            uploads = _context2.sent;
            return _context2.abrupt("return", uploads.reduce(function (carry, arr, index) {
              return _objectSpread(_objectSpread({}, carry), {}, (0, _defineProperty2["default"])({}, filesKeys[index], arr));
            }, {}));

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function pArray(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

var uploadMedia = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(image, enableHash, baseDir) {
    var dir, name, key, uploadResponse, media;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            dir = "".concat(baseDir ? baseDir + '/' : '');
            name = enableHash ? "".concat(uuid()) : "".concat(getWithoutExtension(image.name), "_").concat(shortid.generate());
            key = "".concat(dir).concat(name, ".").concat(getExtension(image.name));
            _context3.next = 5;
            return utilsS3.uploadObject(image.data, key);

          case 5:
            uploadResponse = _context3.sent;
            media = new MediaModel({
              originalName: image.name,
              mimeType: image.mimetype,
              size: image.size,
              etag: uploadResponse.ETag,
              location: uploadResponse.Location,
              filename: uploadResponse.Key,
              key: key
            });
            _context3.next = 9;
            return media.save();

          case 9:
            return _context3.abrupt("return", _context3.sent);

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function uploadMedia(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}(); // GET URL


var generateGetUrl = function generateGetUrl(req, res, next) {
  // Both Key and ContentType are defined in the client side.
  // Key refers to the remote name of the file.
  var Key = req.query.Key;
  utilsS3.generateGetUrl(Key).then(function (getURL) {
    res.json({
      success: true,
      data: {
        getURL: getURL
      }
    });
  })["catch"](function (err) {
    next(err);
  });
}; // PUT URL


var generatePutUrl = function generatePutUrl(req, res, next) {
  // Both Key and ContentType are defined in the client side.
  // Key refers to the remote name of the file.
  // ContentType refers to the MIME content type, in this case image/jpeg
  var _req$query = req.query,
      Key = _req$query.Key,
      ContentType = _req$query.ContentType;
  utilsS3.generatePutUrl(Key, ContentType).then(function (putURL) {
    res.json({
      success: true,
      data: {
        putURL: putURL
      }
    });
  })["catch"](function (err) {
    next(err);
  });
};

module.exports = {
  getS3Config: getS3Config,
  postObjects: postObjects,
  generateGetUrl: generateGetUrl,
  generatePutUrl: generatePutUrl
};