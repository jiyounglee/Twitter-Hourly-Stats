'use strict';

var express = require('express');
var tokenController = require('./twitter.token.controller.js');
var statsController = require('./twitter.stats.controller.js');

var router = express.Router();

router.get('/token', tokenController.get);
router.get('/stats', statsController.get);

module.exports = router;
