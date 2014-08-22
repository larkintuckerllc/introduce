var express = require('express');
var router = express.Router();
var organizers = require('../controllers/organizers');

module.exports = router;
router.get('/', organizers.findAll);

module.exports = router;
