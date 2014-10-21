var http = require('http');
var config = require('config');
var LinkedIn = require('../models/linkedin');
var channels = require('./channels.js');

exports.searching = function(req, res) {
	res.setHeader("cache-control","private, max-age=0, no-cache");
        var token = req.query.token;
	var person = req.query.person;
	LinkedIn.authenticated(token,
		function(credential) {
			// SUCCESS
			channels.message(person, {state: 'searching', person: credential.person},
				function() {
					// SUCCESS
					res.send('');
				},
				function() {
					// ERROR
					res.statusCode = 500;
					res.send('');
				}
			);
		},
		function() {
			// ERROR
			res.statusCode = 401;
			res.send('');
		}
	);
}

exports.ping = function(req, res) {
	res.setHeader("cache-control","private, max-age=0, no-cache");
        var token = req.query.token;
	var person = req.query.person;
	LinkedIn.authenticated(token,
		function(credential) {
			// SUCCESS
			channels.message(person, {ping: true, person: credential.person},
				function() {
					// SUCCESS
					res.send('');
				},
				function() {
					// ERROR
					res.statusCode = 500;
					res.send('');
				}
			);
		},
		function() {
			// ERROR
			res.statusCode = 401;
			res.send('');
		}
	);
};;

exports.found = function(req, res) {
	res.setHeader("cache-control","private, max-age=0, no-cache");
        var token = req.query.token;
	var person = req.query.person;
	LinkedIn.authenticated(token,
		function(credential) {
			// SUCCESS
			channels.message(person, {state: 'found', person: credential.person},
				function() {
					// SUCCESS
					res.send('');
				},
				function() {
					// ERROR
					res.statusCode = 500;
					res.send('');
				}
			);
		},
		function() {
			// ERROR
			res.statusCode = 401;
			res.send('');
		}
	);
};;

exports.meeting = function(req, res) {
	res.setHeader("cache-control","private, max-age=0, no-cache");
        var token = req.query.token;
	var person = req.query.person;
	LinkedIn.authenticated(token,
		function(credential) {
			// SUCCESS
			channels.message(person, {state: 'meeting', person: credential.person},
				function() {
					// SUCCESS
					res.send('');
				},
				function() {
					// ERROR
					res.statusCode = 500;
					res.send('');
				}
			);
		},
		function() {
			// ERROR
			res.statusCode = 401;
			res.send('');
		}
	);
};;

exports.cancel = function(req, res) {
	res.setHeader("cache-control","private, max-age=0, no-cache");
        var token = req.query.token;
	var person = req.query.person;
	LinkedIn.authenticated(token,
		function(credential) {
			// SUCCESS
			channels.message(person, {state: 'cancel', person: credential.person},
				function() {
					// SUCCESS
					res.send('');
				},
				function() {
					// ERROR
					res.statusCode = 500;
					res.send('');
				}
			);
		},
		function() {
			// ERROR
			res.statusCode = 401;
			res.send('');
		}
	);
};;

