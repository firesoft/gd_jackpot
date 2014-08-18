"use strict";

var jackpotModel = require('../models/jackpot.js');

function getAll(req, res, next) {
	jackpotModel.getAll(function(err, data) {
		if (err) return next(err);
		res.json(data);
	});
}

module.exports.getAll = getAll;