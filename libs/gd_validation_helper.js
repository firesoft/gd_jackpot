"use strict";

var _ = require('lodash');
var expressValidator = require('express-validator');
var functions = require('./functions.js');

function sanitizeParamsToInt(req, params) {
	params.forEach(function(param) {
		req.sanitize(param).toInt();
	});
}

function sanitizeParamToArrayOfInts(req, param) {
	var value = req.param(param).toString();
	var arr = value.split(',').map(functions.toInt);
	req.updateParam(param, arr);
}

function compactParamArray(req, param) {
	req.updateParam(param, _.compact(req.param(param)));
}

function checkValidationErrors(req) {
	var errors = req.validationErrors();
	if (errors) {
		var err = new Error( _.uniq(_.pluck(errors, 'msg')).join(' '));
		err.status = 400;
		return err;
	}
	return null;
}

function extendExpressValidator(name, func) {
	expressValidator.validator.extend(name, func);
}

extendExpressValidator('isPositive', functions.isPositive);

module.exports.checkValidationErrors = checkValidationErrors;
module.exports.sanitizeToInt = sanitizeParamsToInt;
module.exports.sanitizeParamsToInt = sanitizeParamsToInt;
module.exports.sanitizeParamToArrayOfInts = sanitizeParamToArrayOfInts;
module.exports.compactParamArray = compactParamArray;
module.exports.extendExpressValidator = extendExpressValidator;