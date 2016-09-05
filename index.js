"use strict";

/***
 * @author Eduardo Hattori
 * @date 04/09/16.
 */
var Writable = require('stream').Writable;
var util = require('util');
var mysql    = require('mysql');
var moment   = require('moment');

var levels = {
  10: 'trace',
  20: 'debug',
  30: 'info',
  40: 'warn',
  50: 'error',
  60: 'fatal'
};

function MySqlStream(options){
  options = options || {};
  this._table = options.table || 'log';
  this._conn  =  mysql.createConnection({
    host     : options.host,
    user     : options.user,
    password : options.password,
    database : options.database
  });
  Writable.call(this, {});
}

util.inherits(MySqlStream, Writable);

MySqlStream.prototype._write = function(entry, encoding , callback){

  entry = JSON.parse(entry.toString('utf8'));
  console.log(entry);

  var self = this;
  this._conn.connect();
  callback();
};

