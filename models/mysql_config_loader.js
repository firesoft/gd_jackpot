"use strict";

var fs = require('fs');
var iniparser = require('iniparser');
var gdConfig = require('../libs/gd_config.js');

var sets = 1;
var slaves = 2;

var rawData = null;

function load(path) {
	loadDBConfig(gdConfig.get('mysqlConfigFile'));
	return parseRawData();
}

function loadDBConfig(path) {
	if (!fs.existsSync(path)) {
		throw new Error(path + ' not exists!');
	}
	rawData = iniparser.parseSync(path);
}

function parseRawData() {
	var config = {};
	
	for (var set=1; set<=sets; set++) {
		var setKey = 'set-' + set;
		config[setKey] = {};
		config[setKey]['master'] = getConfigFor(set, 'master');
		
		for(var slave=1; slave<slaves; slave++) {
			config[setKey]['slave-' + slave] = getConfigFor(set, 'slave'+slave);
		}
	}
	return config;
}

function getConfigFor(setNumber, connection) {
	var configName = 'SET' + setNumber + '_' + connection.toUpperCase();
	var hostAndPort = rawData[configName].split(':');
	
	var config = {};
	config.host = hostAndPort[0];
	config.port = hostAndPort[1];
	config.user = rawData['DB_WWW_LOGIN'];
	config.password = rawData['DB_WWW_PASSWD'];
	
	return config;
}

module.exports.load = load;