"use strict";

var jackpotModel = require('../models/jackpot.js');
var winnersModel = require('../models/winners.js');
var badbeatWinnersModel = require('../models/badbeat_winners.js');
var gdValidationHelper = require('../libs/gd_validation_helper.js');

function get(req, res, next) {
	var type = req.parsedData.type;
	var model = getModel(type);
	model.get(req.parsedData.type, req.parsedData.limit, function(err, winners) {
		if (err) return next(err, null);
		res.json(winners);
	});
}

function getModel(type) {
	if (type == 'badbeat') {
		return badbeatWinnersModel;
	}
	return winnersModel;
}

function validate(req, res, next) {
	req.checkParams('type', 'Invalid type param.').notEmpty().isTypeValid();
	if (!req.query.limit) {
		req.query.limit = 30;
	}
	req.checkQuery('limit', 'Invalid limit param.').isInt().isPositive(); 
	
	var err = gdValidationHelper.checkValidationErrors(req);
	if (err) return next(err); 
	
	req.sanitize('limit').toInt();
	var limit = applyMaxLimit(req.params.type, req.query.limit);
	
	req.parsedData = {};
	req.parsedData.type = req.params.type;
	req.parsedData.limit = limit;
	
	next();
}

function applyMaxLimit(type, limit) {
	var maxLimit = 30;
	if (type == 'badbeat') {
		maxLimit = 10;
	}
	return Math.max(limit, maxLimit);
}

gdValidationHelper.extendExpressValidator('isTypeValid', jackpotModel.isTypeValid);

module.exports.get = get;
module.exports.validate = validate;