// DATABASE CONNECTION
var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
mongoose.connect('mongodb://localhost/hellodb');

require('../server/models/persons');
require('../server/models/events');
var Organizer = require('../server/models/organizers');

var organizer = new Organizer({event: '53b7d981e7eebbc107527aef', person: 'zDmzQyQfNF'});		
organizer.save(function(err) {
	if (!err) {
		console.log(organizer);
		process.exit(0);
	} else {
		process.exit(1);
	}		
});
