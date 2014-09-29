// DATABASE CONNECTION
var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
mongoose.connect('mongodb://localhost/hellodb');

var Event = require('../server/models/events');

var event = new Event({
	name: 'September Test Event', 
	start: 1409544000000, 
	end: 1412136000000,
	link: 'http://gainnet.org',
	image: 'assets/dynamic/img/gain.png' 
});		
event.save(function(err) {
	if (!err) {
		console.log(event);
		process.exit(0);
	} else {
		process.exit(1);
	}		
});
