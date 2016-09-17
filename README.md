bunyan-mysql
====================

A Bunyan stream for saving logs into Mysql.

## Install

```
npm install bunyan-mysql
```

## Create Table

Create table in your host

```
CREATE TABLE log(
	name varchar(200),
	hostname varchar(200),
	msg varchar(21845),
	pid integer,
	level integer,
	time datetime,
	v integer
);
```

## Example

```
var bunyan      = require('bunyan');
var MySqlStream = require('bunyan-mysql');

var msqlStream = new MySqlStream({
    host     : 'localhost',
    user     : 'user',
    password : 'pass',
    database : 'database',
    port     : 3306
});

msqlStream.on('error', function (err) {
    console.log('MySQL Stream Error:', err.stack);
});

var log = bunyan.createLogger({
    name: "My Application",
    streams: [
        { stream: process.stdout },
        { stream: msqlStream }
    ],
    serializers: bunyan.stdSerializers
});

log.info('Oh My God, this works!!!');

```

## Options

* `host`: The hostname of the database you are connecting to. (Default: `localhost`)
* `user`: The MySQL user to authenticate as.
* `password`: The password of that MySQL user.
* `database`: Name of the database to use for this connection (Optional).
* `port`: The port number to connect to. (Default: `3306`)
* `table`: Name of table log. (Default: `log`)
* `connectionLimit`: The maximum number of connections to create at once.
  (Default: `10`)