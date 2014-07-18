var express = require('express');
var router = express.Router();
var linkedin = require('../controllers/linkedin');

router.get('/login', linkedin.login);
router.get('/callback', linkedin.callback);

module.exports = router;
