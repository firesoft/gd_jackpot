"use strict";

var router = require('express').Router();

var winnersController = require('../controllers/winners.js');

router.get('/winners/:type', winnersController.validate, winnersController.get);

module.exports = router;