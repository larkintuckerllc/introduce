var LinkedIn = require('../models/linkedin');
var Scanning = require('../models/scannings');

exports.findAll = function(req, res) {
	res.setHeader("cache-control","private, max-age=0, no-cache");
        var token = req.query.token;
	LinkedIn.authenticated(token,
		function(credential) {
			// SUCCESS
			var conditions = {};
			if (req.query.event) {
				conditions.event = req.query.event;
			}
			Scanning.find(conditions, 
				function(err, scannings) {
					if (!err) {
						res.send(scannings);
					} else {
						res.statusCode = 500;
						res.send('');
					}
				}
			);
		},
		function() {
			// ERROR
			res.statusCode = 401;
			res.send('');
        	}
	);
};

exports.findById = function(req, res) {
	res.setHeader("cache-control","private, max-age=0, no-cache");
        var token = req.query.token;
	LinkedIn.authenticated(token,
		function(credential) {
			// SUCCESS
			var _id = req.params._id;
			Scanning.findById(_id, function(err, scanning) {
				if (!err) {
					if (scanning) {	
						res.send(scanning);
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
				var d = new Date();
				var scanning = new Scanning({_id: credential.person, event: req.body.event, order: d.getTime()});		
				scanning.save(function(err) {
					if (!err) {
						res.send(scanning);
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
}

exports.delete = function(req, res) {
	res.setHeader("cache-control","private, max-age=0, no-cache");
        var token = req.query.token;
	LinkedIn.authenticated(token,
		function(credential) {
			// SUCCESS
			// IGNORING req.params._id USING credential.person
			Scanning.findByIdAndRemove(credential.person, function(err, scanning) {
				if (!err) {
					if (scanning) {
						res.send(scanning);
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
			res.statusCode = 403;
			res.send('');
		}
	);
};
