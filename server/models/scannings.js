var mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');
var Schema = mongoose.Schema;
var scanningSchema = new Schema({
	_id: {
		type: String,
		ref: 'Channel',
		required: true
	},
	event: {
		type: Schema.Types.ObjectId,
		ref: 'Event',
		required: true
	},
	order: {
		type: Number,
		required: true
	}
});
scanningSchema.plugin(idvalidator);
var Scanning = mongoose.model('Scanning', scanningSchema);
module.exports = Scanning;
