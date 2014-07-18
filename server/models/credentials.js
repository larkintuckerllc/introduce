var mongoose = require('mongoose');
var idvalidator = require('mongoose-id-validator');
var Schema = mongoose.Schema;
var credentialSchema = new Schema({
	_id: {
		type: String,
		required: true
	},
	person: {
		type: String,
		ref: 'Person',
		required: true
	}
	
});
credentialSchema.plugin(idvalidator);
var Credential = mongoose.model('Credential', credentialSchema);
module.exports = Credential;
