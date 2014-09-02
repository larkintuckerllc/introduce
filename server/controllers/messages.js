var http = require('http');
var LinkedIn = require('../models/linkedin');

// TODO JET: REMOVED SECRET
var send = function(person, message, success, error) {
	var options = {
		hostname: 'introduce.solutions',
		port: 3001,
		path: '/message/' + 
			person +
			'?token=XXXXX' + 
			'&data=' + JSON.stringify(message),
		method: 'GET'
	};
	var req2 = http.request(options, function(res2) {
		res2.on('data', function (chunk) {
		});
		res2.on('end', function () {
		});
		if (res2.statusCode == 200) {
			success();
		} else {
			error();	
		}
	});
	req2.on('error', function(e) {
		error();
	});
	req2.end();
};

exports.searching = function(req, res) {
	res.setHeader("cache-control","private, max-age=0, no-cache");
        var token = req.query.token;
	var person = req.query.person;
	LinkedIn.authenticated(token,
		function(credential) {
			// SUCCESS
			send(person, {state: 'searching', person: credential.person},
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

exports.found = function(req, res) {
	res.setHeader("cache-control","private, max-age=0, no-cache");
        var token = req.query.token;
	var person = req.query.person;
	LinkedIn.authenticated(token,
		function(credential) {
			// SUCCESS
			send(person, {state: 'found', person: credential.person},
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
			send(person, {state: 'meeting', person: credential.person},
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
			send(person, {state: 'cancel', person: credential.person},
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

