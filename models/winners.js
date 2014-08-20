"use strict";

var memoryCache = require('memory-cache');
var gdMysql = require('../libs/gd_mysql.js');

var type2gameNumber = {
	poker: [3000, 3001, 3006, 3010],
	bingo: [5000, 5001],
	slots: [8000, 8001, 8002, 8003, 8004, 8005],
	videopoker: [9000, 9001, 9002],
	blackjack: [10000]
}


function get(type, limit, callback) {
	var winners = getFromCache(type, limit);
	if (winners) {
		return callback(null, winners);
	}
	getFromDB(type, limit, function(err, winners) {
		if (err) return callback(err, null);
		putToCache(type, limit, winners);
		callback(null, winners);
	});
}

function getFromDB(type, limit, callback) {
	var gameNumbers = convertTypeToGameNumbers(type);
	var query = 'select `playerId`, `time_awarded` as `timeAwarded`, `real_game_number` as `gameNumber`, `cards`, `money_won` as `moneyWon` from `ganymede_2005`.`data_jackpot_winners_game_chips` where `real_game_number` in(?) limit ' + limit;
	query = gdMysql.format(query, [gameNumbers]);
	gdMysql.query(query, 'slave', callback);
}

function convertTypeToGameNumbers(type) {
	return type2gameNumber[type];
}

function getCacheKey(type, limit) {
	return 'winners_' + type + '_' + limit;
}

function getFromCache(type, limit) {
	return memoryCache.get(getCacheKey(type, limit));
}

function putToCache(type, limit, jackpots) {
	memoryCache.put(getCacheKey(type, limit), jackpots, 30 * 60 * 1000);
}

module.exports.get = get;