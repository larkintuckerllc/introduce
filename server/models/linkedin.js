var Credential = require('./credentials');
var Person = require('./persons');
var https = require('https');
var LinkedIn = {};

LinkedIn.authenticated = function(token, success, error) {
	Credential.findById(token, function(err, credential) {
		if (!err) {
			if (credential) {
				success(credential);
			} else {
				var options = {
					hostname: 'api.linkedin.com',
					port: 443,
					path: '/v1/people/~:(id,first-name,last-name,picture-url)?format=json&oauth2_access_token=' + token,
					method: 'GET'
				}
				var req = https.request(options, function(res) {
					if (res.statusCode == 200) {
						var data = '';
						res.on('data', function (chunk) {
							data = data + chunk;
						});	
						res.on('end', function() {
							var linkedInPerson = JSON.parse(data);
							var person ={_id: linkedInPerson.id, first: linkedInPerson.firstName,
								 last: linkedInPerson.lastName};
							if (linkedInPerson.pictureUrl) {
								person.picture = linkedInPerson.pictureUrl;
							};
							Person.update({_id: person._id}, person, {upsert: true}, function(err) {
								if (!err) {
									var credential = new Credential({_id: token, person: person._id});
									credential.save(function(err) {
										if (!err) {
											success(credential);
										} else {
											error();
										}
									});
								} else {
									error();
								}
							});
						});
					} else {
						error();
					}
				});
				req.on('error', function(e) {
					error();
				});
				req.end();
			}
                } else {
			error();
		}
	});
}

module.exports = LinkedIn;
