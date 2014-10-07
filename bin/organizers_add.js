// DATABASE CONNECTION
var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
mongoose.connect('mongodb://localhost/hellodb');

require('../server/models/persons');
require('../server/models/events');
var Organizer = require('../server/models/organizers');

var organizer = new Organizer({
	event: '542d8bdbf5881ac5088bb908', 
	person: 'zDmzQyQfNF'
});		
organizer.save(function(err) {
	if (!err) {
		console.log(organizer);
		process.exit(0);
	} else {
		process.exit(1);
	}		
});
