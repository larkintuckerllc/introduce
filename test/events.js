var request = require('supertest');
request = request('http://localhost:3000');
var token = 'AQVeqIuJeuDTaqh7o5a-Au1uVtuiXCQ0LxcSijRgdtdSmYQb7vn_1oC621f1y3Dg4gzFrmlv1GA5K4PLRR4x9QOmXzfW1JPtiIeZbNev5aD3ij6LPenL5kNiBYiNHk6GgSlVsQtZfDGELTtawAx8PygYDDZtYutgUEjTyhKabJOUtF9nsiA';

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
