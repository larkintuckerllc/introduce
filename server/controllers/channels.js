var Scannings = require('../models/scannings.js');
var identitySocketMap = {};
var socketIdentityMap = {};
var io;

exports.init = function(server) {
	io = require('socket.io').listen(server);
	io.on('connection', function(socket){
		socket.on('identify', function(data){
			if (data in identitySocketMap) {
				io.to(socket.id).emit('duplicate');	
			} else {
				io.to(socket.id).emit('unique');	
				identitySocketMap[data] = socket.id;
				socketIdentityMap[socket.id] = data;
			}
		});
		socket.on('disconnect', function(){
			Scannings.findByIdAndRemove(socketIdentityMap[socket.id], function(err, scanning) {
			});
			delete identitySocketMap[socketIdentityMap[socket.id]];
			delete socketIdentityMap[socket.id];
		});
	});
};

exports.message = function(_id, data, success, error) {
	if (_id in identitySocketMap) {
		io.to(identitySocketMap[_id]).emit('message', data);
		success();
	} else {
		error();
	}
}
