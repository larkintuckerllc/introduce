var express = require('express');
var router = express.Router();
var scannings = require('../controllers/scannings');

module.exports = router;
router.get('/', scannings.findAll);
router.get('/:_id', scannings.findById);
router.post('/', scannings.add);
router.delete('/:_id', scannings.delete);

module.exports = router;
