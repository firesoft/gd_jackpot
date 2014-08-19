"use strict";

var router = require('express').Router();

var jackpotController = require('../controllers/jackpot.js');

router.get('/jackpot/:type', jackpotController.validate, jackpotController.get);
router.get('/jackpot', jackpotController.getAll);

module.exports = router;