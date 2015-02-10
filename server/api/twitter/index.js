'use strict';

var express = require('express');
var controller = require('./twitter.controller.js');

var router = express.Router();

router.get('/token', controller.get);

module.exports = router;
