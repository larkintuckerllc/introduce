var express = require('express');
var router = express.Router();
var channels = require('../controllers/channels');

module.exports = router;
router.delete('/:_id', channels.delete);

module.exports = router;
