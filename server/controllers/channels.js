var LinkedIn = require('../models/linkedin');
var Channel = require('../models/channels');
var Scanning = require('../models/scannings');

exports.findById = function(req, res) {
	res.setHeader("cache-control","private, max-age=0, no-cache");
        var token = req.query.token;
	LinkedIn.authenticated(token,
		function(credential) {
			// SUCCESS
			var _id = req.params._id;
			Channel.findById(_id, function(err, channel) {
				if (!err) {
					if (channel) {	
						res.send(channel);
					} else {
						res.statusCode = 404;
						res.send('');
					}
				} else {
					res.statusCode = 500;
					res.send('');
				}
			});
		},
		function() {
			// ERROR
			res.statusCode = 401;
			res.send('');
		}
	);
};

exports.add = function(req, res) {
	res.setHeader("cache-control","private, max-age=0, no-cache");
        var token = req.query.token;
	LinkedIn.authenticated(token,
		function(credential) {
			// SUCCESS
			if (req.is('application/json')) {
				var channel = new Channel({_id: credential.person});		
				channel.save(function(err) {
					if (!err) {
						res.send(channel);
					} else {
						res.statusCode = 400;
						res.send(err);
					}		
				});
			} else {
				res.statusCode = 415;
				res.send('');
			}
		},
		function() {
			// ERROR
			res.statusCode = 401;
			res.send('');
        	}
	);
};


exports.delete = function(req, res) {
	res.setHeader("cache-control","private, max-age=0, no-cache");
	var _id = req.params._id;
        var token = req.query.token;
	if (token == 'XXXXXXXXX') {
		Scanning.remove({_id: _id}, function(err) {
			if (!err) {
				Channel.findByIdAndRemove(_id, function(err, channel) {
					if (!err) {
						if (channel) {	
							res.send(channel);
						} else {
							res.statusCode = 404;
							res.send('');
						}
					} else {
						res.statusCode = 500;
						res.send('');
					}
				});
			} else {
				res.statusCode = 500;
				res.send('');
			}
		});
	}
};
