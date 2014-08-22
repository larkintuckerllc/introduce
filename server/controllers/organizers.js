var Organizer = require('../models/organizers');
var LinkedIn = require('../models/linkedin');

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
			Organizer.find(conditions, 
				function(err, organizers) {
					if (!err) {
						res.send(organizers);
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
