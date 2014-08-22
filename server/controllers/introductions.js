var LinkedIn = require('../models/linkedin');
var Introduction = require('../models/introductions');
var Organizer = require('../models/organizers');

exports.findAll = function(req, res) {
	res.setHeader("cache-control","private, max-age=0, no-cache");
        var token = req.query.token;
	LinkedIn.authenticated(token,
		function(credential) {
			// SUCCESS
			var conditions = {};
			if (req.query.event) {
				conditions.event = req.query.event;
				if (req.query.from) {
					conditions.from = credential.person;
				}
				if (req.query.to) {
					conditions.to = credential.person;
				}
				if (req.query.from || req.query.to) {
					Introduction.find(conditions, 
						function(err, introductions) {
							if (!err) {
								res.send(introductions);
							} else {
								res.statusCode = 500;
								res.send('');
							}
						}
					);
				} else {
					Organizer.find(conditions,
						function(err, organizers) {
							if (!err) {
								var isOrganizer = false;
								for (var i = 0; i < organizers.length; i++) {
									if (organizers[i].person == credential.person) {
										isOrganizer = true;
									}
								}
								if (isOrganizer) {
									Introduction.find(conditions, 
										function(err, introductions) {
											if (!err) {
												res.send(introductions);
											} else {
												res.statusCode = 500;
												res.send('');
											}
										}
									);
								} else {
									res.statusCode = 400;
									res.send('');
								}
							} else 	{
								res.statusCode = 500;
								res.send('');
							}
						}
					);
				}
			} else {
				res.statusCode = 400;
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

exports.add = function(req, res) {
	res.setHeader("cache-control","private, max-age=0, no-cache");
        var token = req.query.token;
	LinkedIn.authenticated(token,
		function(credential) {
			// SUCCESS
			if (req.is('application/json')) {
				var introduction = new Introduction({event: req.body.event, from: req.body.from, to: credential.person});		
				introduction.save(function(err) {
					if (!err) {
						res.send(introduction);
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

