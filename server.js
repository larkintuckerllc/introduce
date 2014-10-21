var express = require('express');
var app = express();

// MIDDLEWARE
var serveStatic = require('serve-static');
app.use(serveStatic('public', {
	'index': ['index.html'], 
	'setHeaders': function(res, path) {
		var items = path.split('/');
		if (items[items.length - 1] == 'project.manifest') {
       			res.setHeader('cache-control','private, max-age=0, no-cache');
			res.setHeader('Content-type', 'text/cache-manifest');
		} else {
       			res.setHeader('cache-control', 'max-age=300');
		}
	} 
}));
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// DATABASE CONNECTION
var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
mongoose.connect('mongodb://localhost/hellodb');

// ROUTES
app.use('/linkedin', require('./server/routes/linkedin'));
app.use('/events', require('./server/routes/events'));
app.use('/scannings', require('./server/routes/scannings'));
app.use('/persons', require('./server/routes/persons'));
app.use('/messages', require('./server/routes/messages'));
app.use('/introductions', require('./server/routes/introductions'));
app.use('/organizers', require('./server/routes/organizers'));
//app.use('/channels', require('./server/routes/channels'));

var server = app.listen(3000);

// REAL-TIME ENGINE
require('./server/controllers/channels.js').init(server);
