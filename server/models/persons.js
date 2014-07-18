var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var personSchema = new Schema({
	_id: String,
	first: {
		type: String,
		required: true
	},
	last: {
		type: String,
		required: true
	},
	picture: {
		type: String,
	}
});
var Person = mongoose.model('Person', personSchema);
module.exports = Person;
