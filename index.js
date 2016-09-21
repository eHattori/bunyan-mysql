"use strict";

/***
 * @author Eduardo Hattori
 * @date 04/09/16.
 */
var Writable = require('stream').Writable;
var util     = require('util');
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
  this._options = options || {};
  this._options.table = options.table || 'log';
  this._conn  =  mysql.createPool({
    connectionLimit : (options.connectionLimit || 10),
    host            : options.host,
    user            : options.user,
    password        : options.password,
    database        : options.database
  });
  Writable.call(this, {});
}

util.inherits(MySqlStream, Writable);

MySqlStream.prototype._write = function(entry, encoding , callback){

    entry = JSON.parse(entry.toString('utf8'));
    var sql = "INSERT INTO <DATABASE>.<TABLE> "+
            "( name, hostname, msg, pid, level, time, v) "+
            "VALUES ("+
            mysql.escape(entry.name) + ", " +
            mysql.escape(entry.hostname) + ", " +
            mysql.escape(entry.msg) + ", " +
            mysql.escape(entry.pid) + ", " +
            mysql.escape(entry.level) + ", " +
            "STR_TO_DATE(" + mysql.escape(moment(entry.time).format("YYYY-MM-DD HH:mm:ss")) + ",'%Y-%m-%d %H:%i:%s'), " +
            mysql.escape(entry.v) + ") ";

    sql = sql.replace("<DATABASE>", this._options.database);
    sql = sql.replace("<TABLE>", this._options.table);

    var self = this;

    this._conn.query(sql, entry, function(err) {
        if (err) self.emit('error', err);
            if (err) self.emit('error', err);
    });
    callback();
};

module.exports = MySqlStream;

