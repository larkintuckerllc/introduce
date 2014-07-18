var mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');
var Schema = mongoose.Schema;
var introductionSchema = new Schema({
	event: {
		type: Schema.Types.ObjectId,
		ref: 'Event',
		required: true
	},
	from: {
		type: String,
		ref: 'Person',
		required: true
	},
	to: {
		type: String,
		ref: 'Person',
		required: true
	}	
});
introductionSchema.plugin(idvalidator);
var Introduction = mongoose.model('Introduction', introductionSchema);
module.exports = Introduction;
