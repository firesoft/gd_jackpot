"use strict";

var mysql = require('mysql');
var mysqlConfig = require('../models/jackpot_mysql_config_loader.js').load();

function gdMysql() {

	var poolCluster;
	
	this.escape = function(value) {
		return mysql.escape(value);
	};
	
	this.query = function(query, connName, callback) {
		poolCluster.getConnection(connName, function(err, connection) {
			if (err) return callback(err, null);
			connection.query(query, function(err, result) {
				connection.release();
				callback(err, result);
			});
		});
	};
	
	this.getConnection = function(connName, callback) {
		poolCluster.getConnection(connName, callback);
	};
	
	this.format = mysql.format.bind(mysql);
	
	function initPoolCluster() {
		poolCluster = mysql.createPoolCluster();
		for (var connName in mysqlConfig) {
			poolCluster.add(connName, mysqlConfig[connName]);
		}
	};
	
	initPoolCluster();
}

module.exports = new gdMysql();
