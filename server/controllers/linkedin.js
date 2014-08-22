var https = require('https');
var LinkedIn = require('../models/linkedin');

// TODO JET REMOVED SECRET 
var OAuth2 = {
	clientID: 'XXXXX',
	clientSecret: 'XXXXX',
	site: 'www.linkedin.com',
	authorizationPath: '/uas/oauth2/authorization',
	tokenPath: '/uas/oauth2/accessToken'
};

var redirectURI = 'http://introduce.solutions/linkedin/callback';

exports.login = function(req, res) {
	res.setHeader("cache-control","private, max-age=0, no-cache");
	var state = req.query.state;
	if (state) {
		res.redirect('https://' + 
			OAuth2.site + 
			OAuth2.authorizationPath + 
			'?response_type=code' + 
			'&client_id=' + OAuth2.clientID +
			'&scope=r_basicprofile' +
			'&state=' + state +
			'&redirect_uri=' + redirectURI);
	} else {
		res.redirect('/app/');
	}
};

exports.callback = function(req, res) {
	res.setHeader("cache-control","private, max-age=0, no-cache");
	var code = req.query.code; 
	var state = req.query.state; 
	if (code) {
		var options = {
			hostname: OAuth2.site,
			port: 443,
			path: OAuth2.tokenPath + 
				'?grant_type=authorization_code' +
				'&code=' + code +	
				'&redirect_uri=' + redirectURI +
				'&client_id=' + OAuth2.clientID +
				'&client_secret=' + OAuth2.clientSecret,
			method: 'POST'
		}
		var req2 = https.request(options, function(res2) {
			if (res2.statusCode == 200) {
				var data = '';
				res2.on('data', function (chunk) {
					data = data + chunk;
				});	
				res2.on('end', function() {
					var linkedInToken = JSON.parse(data);	
					LinkedIn.authenticated(linkedInToken.access_token, 
						function(credential) {
							// SUCCESS
							res.redirect('/app/#/?token=' + credential._id +
								'&person=' + credential.person +
								'&state=' + state);
						},
						function() {
							// ERROR
							res.redirect('/app/');
						}
					);
				});
	
			} else {
				res.redirect('/app/');
			}
  		});
		req2.on('error', function(e) {
			res.redirect('/app/');
		});
		req2.end();
	} else {
		res.redirect('/app/');
	}
};
