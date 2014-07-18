var express = require('express');
var router = express.Router();
var events = require('../controllers/events');

router.get('/', events.findAll);
router.get('/:_id', events.findById);
router.post('/', events.add);
router.delete('/:_id', events.delete);

module.exports = router;
