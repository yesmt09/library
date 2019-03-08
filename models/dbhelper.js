"use strict";

var mysql = require('mysql');
var logger = require('logger').createLogger();
var config=require('../config');

var DB={};

module.exports = DB;

//sql语句执行
DB.exec=function(sqls, values, after) {
	logger.info('sql:', sqls);
	var pool = mysql.createPool(config);
	pool.getConnection(function(err, connection) {
	    // Use the connection
	    connection.query( sqls || '',values || [], function(err, rows) {
	        // And done with the connection.
	        after(err, rows);
	        connection.release();

	        // Don't use the connection here, it has been returned to the pool.
	    });
	});
	pool.on('error', function(err) {
		if (err.errno != 'ECONNRESET') {
			after("err01", false);
			throw err;
		} else {
			after("err02", false);
		}
	});
};

//事务连接
DB.getConnection=function(callback){
	var connection=mysql.createConnection(config);
	connection.connect(function(err){
		if(err){
			console.error('error connecting: ' + err.stack);
		}
		callback(err,connection);
	});
}