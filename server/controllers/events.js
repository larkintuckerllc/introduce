var Event = require('../models/events');
var LinkedIn = require('../models/linkedin');

exports.findAll = function(req, res) {
	res.setHeader("cache-control","private, max-age=0, no-cache");
        var token = req.query.token;
	LinkedIn.authenticated(token,
		function(credential) {
			// SUCCESS
                        var minEnd = 0;
                        if (req.query.min_end) {
                               minEnd = req.query.min_end; 
                        }
			Event.find({})
				.where('end').gt(minEnd)
				.exec(
					function(err, events) {
						if (!err) {
							res.send(events);
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
			Event.findById(_id, function(err, event) {
				if (!err) {
					if (event) {	
						res.send(event);
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
