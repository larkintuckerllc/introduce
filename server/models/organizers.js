var mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');
var Schema = mongoose.Schema;
var organizerSchema = new Schema({
	event: {
		type: Schema.Types.ObjectId,
		ref: 'Event',
		required: true
	},
	person: {
		type: String,
		ref: 'Person',
		required: true
	}
});
organizerSchema.plugin(idvalidator);
var Organizer = mongoose.model('Organizer', organizerSchema);
module.exports = Organizer;
