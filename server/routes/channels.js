var express = require('express');
var router = express.Router();
var channels = require('../controllers/channels');

module.exports = router;
router.get('/:_id', channels.findById);
router.post('/', channels.add);
router.delete('/:_id', channels.delete);

module.exports = router;
