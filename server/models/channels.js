var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var channelSchema = new Schema({
	_id: String
});
var Channel = mongoose.model('Channel', channelSchema);
module.exports = Channel;
