"use strict";

var _ = require('lodash');
var functions = require('../libs/functions.js');
var mysqlConfigLoader = require('./mysql_config_loader.js');
var gdConfig = require('../libs/gd_config.js');

var rawConfig = null;

function load() {
	loadConfig();
	
	return {
		master: getConnectionConfig('set-1', 'master'),
		slave: getConnectionConfig('set-1', 'slave-1')
	};
}

function getConnectionConfig(set, connection) {
	return _.extend(functions.clone(rawConfig[set][connection]), {connectionLimit: 100});
}

function loadConfig() {
	var path = gdConfig.get('mysqlConfigFile');
	rawConfig = mysqlConfigLoader.load(path);
}

module.exports.load = load;