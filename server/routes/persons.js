var express = require('express');
var router = express.Router();
var persons = require('../controllers/persons');

router.get('/:_id', persons.findById);

module.exports = router;
