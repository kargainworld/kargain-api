"use strict";

require('dotenv').config(); // Loading dotenv to have access to env variables


var config = require('../config');

var AWS = require('aws-sdk'); // Requiring AWS SDK.


var AWSConfig = {
  accessKeyId: config.aws.s3.S3_KEY,
  // stored in the .env file
  secretAccessKey: config.aws.s3.S3_SECRET,
  // stored in the .env file
  region: config.aws.s3.BUCKET_REGION // This refers to your bucket configuration.

}; // Configuring AWS

AWS.config = new AWS.Config(AWSConfig); // Creating a S3 instance

var s3 = new AWS.S3(); // Retrieving the bucket name from env variable

var Bucket = config.aws.s3.BUCKET_NAME; // In order to create pre-signed GET adn PUT URLs we use the AWS SDK s3.getSignedUrl method.
// getSignedUrl(operation, params, callback) ⇒ String
// For more information check the AWS documentation: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html

function getConfig() {
  return AWSConfig;
}

function uploadObject(buffer, key) {
  var contentType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'image/jpeg';
  var acl = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'public-read';
  return new Promise(function (resolve, reject) {
    var params = {
      Bucket: Bucket,
      Body: buffer,
      Key: key,
      ContentType: contentType,
      ACL: acl
    };
    s3.upload(params, function (err, response) {
      if (err) {
	reject(err);
      } else {
	resolve(response);
      }
    });
  });
} // GET URL Generator


function generateGetUrl(Key) {
  return new Promise(function (resolve, reject) {
    var params = {
      Bucket: Bucket,
      Key: Key,
      Expires: 120 // 2 minutes

    }; // Note operation in this case is getObject

    s3.getSignedUrl('getObject', params, function (err, url) {
      if (err) {
	reject(err);
      } else {
	// If there is no errors we will send back the pre-signed GET URL
	resolve(url);
      }
    });
  });
} // PUT URL Generator


function generatePutUrl(Key, ContentType) {
  return new Promise(function (resolve, reject) {
    // Note Bucket is retrieved from the env variable above.
    var params = {
      Bucket: Bucket,
      Key: Key,
      ContentType: ContentType
    }; // Note operation in this case is putObject

    s3.getSignedUrl('putObject', params, function (err, url) {
      if (err) {
	reject(err);
      } // If there is no errors we can send back the pre-signed PUT URL


      resolve(url);
    });
  });
} // Finally, we export the methods so we can use it in our main application.


module.exports = {
  getConfig: getConfig,
  uploadObject: uploadObject,
  generateGetUrl: generateGetUrl,
  generatePutUrl: generatePutUrl
};
