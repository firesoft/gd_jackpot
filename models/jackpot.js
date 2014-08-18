"use strict";

var _ = require('lodash');
var async = require('async');
var memoryCache = require('memory-cache');
var gdMysql = require('../libs/gd_mysql.js');


var jackpotTables = [
	'cfg_bingo_settings',
	'cfg_slots_settings',
	'cfg_poker_settings'
];

var jackpotKeys = {
	bingo: 'bingo_current_jackpot_game_chips',
	slots: 'slots_current_jackpot_game_chips',
	videopoker: 'videopoker_current_jackpot_game_chips',
	blackjack: 'blackjack_current_jackpot_game_chips',
	poker: 'poker_current_jackpot_game_chips',
	badbeat: 'poker_current_badbeat_jackpot_game_chips'
};

function getAll(callback) {
	var jackpotData = getFromCache();
	if (jackpotData) {
		return callback(null, jackpotData);
	}
	getFromDB(function(err, rows) {
		if (err) return callback(err, null);
		jackpotData = _.defaults(convertRowsToJackpotData(rows), getDefaultJackpotData());
		putToCache(jackpotData);
		callback(null, jackpotData);
	})
}

function getFromDB(callback) {
	async.map(jackpotTables, getDataFromDBTable, function(err, data) {
		if (err) return callback(err, {});
		callback(null, _.flatten(data, true));
	});
}

function getDataFromDBTable(table, callback) {
	var query = gdMysql.format('select * from `ganymede_2005`.`' + table + '` where `key` in(?)', [getTableKeys()]);
	gdMysql.query(query, 'slave', callback);
}

function getTableKeys() {
	return _.values(jackpotKeys);
}

function convertRowsToJackpotData(rows) {
	var keys2type = _.invert(jackpotKeys);
	return rows.reduce(function(jackpotData, row) {
		jackpotData[keys2type[row.key]] = row.value;
		return jackpotData;
	}, {});
}

function getDefaultJackpotData() {
	var def = {};
	for(var type in jackpotKeys) {
		def[type] = 0;
	}
	return def;
}

function getFromCache() {
	return memoryCache.get(getCacheKey());
}

function getCacheKey() {
	return 'jackpots';
}

function putToCache(jackpots) {
	memoryCache.put(getCacheKey(), jackpots, 10 * 60 * 1000);
}

module.exports.getAll = getAll;