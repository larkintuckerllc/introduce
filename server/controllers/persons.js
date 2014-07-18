var Person = require('../models/persons');
var LinkedIn = require('../models/linkedin');

exports.findById = function(req, res) {
	res.setHeader("cache-control","private, max-age=0, no-cache");
        var token = req.query.token;
	LinkedIn.authenticated(token,
		function(credential) {
			// SUCCESS
			var _id = req.params._id;
			Person.findById(_id, function(err, person) {
				if (!err) {
					if (person) {	
						res.send(person);
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
