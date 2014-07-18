var express = require('express');
var router = express.Router();
var introductions = require('../controllers/introductions');

module.exports = router;
router.get('/', introductions.findAll);
router.post('/', introductions.add);

module.exports = router;
