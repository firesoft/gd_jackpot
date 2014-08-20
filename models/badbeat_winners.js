"use strict";

var _ = require('lodash');
var async = require('async');
var memoryCache = require('memory-cache');
var gdMysql = require('../libs/gd_mysql.js');

function get(type, limit, callback) {
	var winners = getFromCache(limit);
	if (winners) {
		return callback(null, winners);
	}
	getFromDB(limit, function(err, winners) {
		if (err) return callback(err, null);
		putToCache(limit, winners);
		callback(null, winners);
	});
}

function getFromDB(limit, callback) {
	async.waterfall([
		function(next) {
			next(null, limit);
		},
		getHands,
		getWinners,
		processWinnersRows
	],callback);
}

function getHands(limit, callback) {
	var query = 'select distinct handId from `ganymede_2005`.`data_badbeat_jackpot_winners_game_chips` order by time_awarded desc limit ' + limit;
	gdMysql.query(query, 'slave', function(err, hands) {
		if (err) return callback(err, null);
		callback(null, _.pluck(hands, 'handId'));
	});
}

function getWinners(hands, callback) {
	var fields = '`handId`, `playerId`, `time_awarded` as `timeAwarded`, `game_number` as `gameNumber`, `prize_type` as `prizeType`, `cards`, `money_won` as `moneyWon`';
	var query = 'select ' + fields + ' from `ganymede_2005`.`data_badbeat_jackpot_winners_game_chips` where `handId` in (?)';
	query = gdMysql.format(query, [hands]);
	gdMysql.query(query, 'slave', callback);
}

//[{handId, timeAwarded, winners:[{playerId,cards, moneyWon, prizeType}, ...]}, ...]

function processWinnersRows(rows, callback) {
	callback(null, rows.reduce(processWinnerRow, []));
}

function processWinnerRow(winners, row) {
	var jackpotObject = _.findWhere(winners, {handId: row.handId});
	var winnerObject = getWinnerObjectFromRow(row);
	if (!jackpotObject) {
		jackpotObject = {handId: row.handId, timeAwarded: row.timeAwarded, gameNumber: row.gameNumber, winners: []};
		winners.push(jackpotObject);
	}
	jackpotObject.winners.push(winnerObject);
	return winners;
}

function getWinnerObjectFromRow(row) {
	return {playerId: row.playerId, cards: row.cards, moneyWon: row.moneyWon, prizeType: row.prizeType};
}

function getCacheKey(limit) {
	return 'winners_badbeat_' + limit;
}

function getFromCache(limit) {
	return memoryCache.get(getCacheKey(limit));
}

function putToCache(limit, jackpots) {
	memoryCache.put(getCacheKey(limit), jackpots, 60 * 60 * 1000);
}

module.exports.get = get;