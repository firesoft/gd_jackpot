"use strict";

var router = require('express').Router();

var rulesController = require('../controllers/rules.js');

router.get('/rules/:type', rulesController.validate, rulesController.get);

module.exports = router;