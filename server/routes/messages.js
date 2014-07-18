var express = require('express');
var router = express.Router();
var messages = require('../controllers/messages');

router.get('/searching', messages.searching);
router.get('/found', messages.found);
router.get('/meeting', messages.meeting);

module.exports = router;
