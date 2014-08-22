var Scanning = require('../models/scannings');

exports.delete = function(req, res) {
	res.setHeader("cache-control","private, max-age=0, no-cache");
        var token = req.query.token;
        var _id = req.params._id;
	if (token == 'secret') {
		Scanning.findByIdAndRemove(_id, function(err, scanning) {
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
	} else {
		res.statusCode = 401;
		res.send('');
	}
};
