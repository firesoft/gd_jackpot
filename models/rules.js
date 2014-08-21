"use strict";

var _ = require('lodash');
var async = require('async');
var memoryCache = require('memory-cache');
var gdMysql = require('../libs/gd_mysql.js');

var databaseKeyToPokerGameNumber = {
	min_jackpot_hand_3000: 3000,
	min_jackpot_hand_3001: 3001,
	min_jackpot_hand_3006: 3006
}

var rules = {
	slots: [
		{cost: 10, percent: 20},
		{cost: 100, percent: 40},
		{cost: 1000, percent: 80}
	],
	videopoker: [
		{cost: 10, percent: 20},
		{cost: 100, percent: 40},
		{cost: 1000, percent: 80}
	],
	blackjack: [
		{cost: 100, percent: 40},
		{cost: 1000, percent: 80}
	],
	badbeat: [
		{prizeType: 'loser', percent: 50},
		{prizeType: 'winner', percent: 25},
		{prizeType: 'participant', percent: 25}
	]
}

function get(type, callback) {
	var rules = getFromCache(type);
	if (rules) {
		return callback(null, rules);
	}
	var rules = {};
	
	async.parallel({
		percentRules: _.curry(getPercentRules)(type),
		minimalCards: _.curry(getMinimalCards)(type)
	}, function(err, rules) {
		if (err) return callback(err, null);
		rules = postProcessRulesObject(rules);
		putToCache(type, rules);
		callback(null, rules);
	});
}

function postProcessRulesObject(rules) {
	if (!rules.percentRules) {
		delete rules.percentRules;
	}
	if (!rules.minimalCards) {
		delete delete rules.minimalCards;
	}
	return rules;
}

function getPercentRules(type, callback) {
	if (!rules.hasOwnProperty(type)) {
		return callback(null, null);
	}
	callback(null, rules[type]);
}

function getMinimalCards(type, callback) {
	if (type == 'poker') {
		return getPokerMinimalCardsFromDB(callback);
	} else if (type == 'badbeat') {
		return getBadbeatMinimalCardsFromDB(callback);
	}
	return callback(null, null);
}

function getPokerMinimalCardsFromDB(callback) {
	var query = 'select * from ganymede_2005.cfg_poker_settings where `key` in(?)';
	query = gdMysql.format(query, [_.keys(databaseKeyToPokerGameNumber)]);
	gdMysql.query(query, 'slave', function(err, rows) {
		if (err) return callback(err, null);
		callback(null, processPokerMinimalCardsRows(rows));
	});
}

function processPokerMinimalCardsRows(rows) {
	return rows.map(function(row) {
		return {gameNumber: databaseKeyToPokerGameNumber[row.key], cards: row.value};
	});
}

function getBadbeatMinimalCardsFromDB(callback) {
	var query = 'select * from ganymede_2005.cfg_poker_settings where `key` in(?)';
	query = gdMysql.format(query, ['badbeatjackpot_minimal_cards']);
	gdMysql.query(query, 'slave', function(err, rows) {
		if (err) return callback(err, null);
		callback(null, processBadbeatMinimalCardsRows(rows));
	});
}

function processBadbeatMinimalCardsRows(rows) {
	if (!rows.length) {
		return '';
	}
	return rows[0]['value'];
}

function getCacheKey(type) {
	return 'rules_' + type;
}

function getFromCache(type) {
	return memoryCache.get(getCacheKey(type));
}

function putToCache(type, rules) {
	memoryCache.put(getCacheKey(type), rules, 3600 * 1000);
}

module.exports.get = get;