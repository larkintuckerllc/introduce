var express = require('express');
var router = express.Router();
var events = require('../controllers/events');

router.get('/', events.findAll);
router.get('/:_id', events.findById);

module.exports = router;
