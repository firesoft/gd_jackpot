"use strict";

var jackpotModel = require('../models/jackpot.js');
var gdValidationHelper = require('../libs/gd_validation_helper.js');

function get(req, res, next) {
	jackpotModel.get(req.parsedData.type, function(err, jackpotValue) {
		if (err) return callback(err, null);
		res.json({value: jackpotValue});
	});
}

function getAll(req, res, next) {
	jackpotModel.getAll(function(err, data) {
		if (err) return next(err);
		res.json(data);
	});
}

function validate(req, res, next) {
	req.checkParams('type', 'Invalid type param.').notEmpty().isTypeValid();
	var err = gdValidationHelper.checkValidationErrors(req);
	if (err) return next(err); 
	req.parsedData = {};
	req.parsedData.type = req.params.type;
	next();
}

gdValidationHelper.extendExpressValidator('isTypeValid', jackpotModel.isTypeValid);

module.exports.get = get;
module.exports.validate = validate;
module.exports.getAll = getAll;