"use strict";

var jackpotModel = require('../models/jackpot.js');
var rulesModel = require('../models/rules.js');
var gdValidationHelper = require('../libs/gd_validation_helper.js');

function get(req, res, next) {
	var type = req.parsedData.type;
	rulesModel.get(req.parsedData.type, function(err, rules) {
		if (err) return next(err, null);
		res.json(rules);
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