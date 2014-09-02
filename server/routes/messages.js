var express = require('express');
var router = express.Router();
var messages = require('../controllers/messages');

router.get('/searching', messages.searching);
router.get('/found', messages.found);
router.get('/meeting', messages.meeting);
router.get('/cancel', messages.cancel);

module.exports = router;
