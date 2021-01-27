"use strict";

var mongoose = require('mongoose');

var config = require('./config');

var app = require('./app');

mongoose.Promise = global.Promise; // set mongo up to use promises

mongoose.set('debug', true);
mongoose.connect(config.db.mongo_location, {
  useCreateIndex: true,
  useNewUrlParser: true
})["catch"](function () {
  throw new Error('*** Can Not Connect to Mongo Server:' + config.db.mongo_location);
});
var db = mongoose.connection;
db.once('open', function () {
  console.log('Connected to mongo at ' + config.db.mongo_location);
  var server = app.listen(config.port, 'localhost', function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('There will be dragons http://' + host + ':' + port);
  });
});
db.on('error', console.error.bind(console, 'connection error:'));
db.on('close', function () {
  console.log('Mongoose default connection disconnected through app termination');
}); // If the Node process ends, close the Mongoose connection
// eslint-disable-next-line no-undef

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination'); // eslint-disable-next-line no-undef

    return process.exit(0);
  });
});