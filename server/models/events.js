var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var eventSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	start: {
		type: Number,
		required: true
	},
	end: {
		type: Number,
		required: true
	},
	image: {
		type: String,
		required: true
	},
	link: {
		type: String,
		required: true
	}
});
eventSchema.path('start').validate(function(val) {
	return val === parseInt(val);
}, 'must be an integer');
eventSchema.path('end').validate(function(val) {
	return (val === parseInt(val)) && (val > this.start);
}, 'must be an integer and greater than start');
var Event = mongoose.model('Event', eventSchema);
module.exports = Event;
