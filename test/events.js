var request = require('supertest');
request = request('http://localhost:3000');
var token = 'AQV6jkGniAc4LSqVZ7XQS_vlZNfCJW5xaHiClMXmp0jRjOgHqOJDSicq980BOSwtJqHN6kxoBWq6fGdZIm__6Wl08uE_iTjl9I9bhJyr2U_3jo_jxFu50K0FjrRvQjtFZUblyp-IpaxvNYxXeUhLdbwKs2cqI0rAjey_biKt1cflhUEnSX0';

describe('Events', function() {
	it('respond with json', function(done) {
		request
		.get('/events?token=' + token)
		.expect('Content-Type', 'application/json; charset=utf-8')
		.expect(200)
		.end(function(err, res) {
			if (err) return done(err);
			done();
		});
	})
});
