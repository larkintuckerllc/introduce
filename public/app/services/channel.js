var module = angular.module('channelServices', []);

module.service('channel', ['$window', function($window) {
	var service = {
		running: false
	};
	var _id;
	var error;
	var message;
	var close;
	var socket;
	var reset = function() {
		service.running = false;
		_id = null;
		error = null;
		message = null;
		close = null;
	}
	service.open = function(p__id, success, p_error, p_message, p_close) {
		_id = p__id;
		error = p_error;
		message = p_message;
		close = p_close;
		if (!service.running) {
			service.running = true;
			socket = $window.io.connect('/',{forceNew: true});
			socket.on('connect', function() {
				socket.emit('identify', _id);
			});
			socket.on('error', function() {
				error(500);
				close();
				reset();
			});
			socket.on('unique', function() {
				success();
			});
			socket.on('duplicate', function() {
				socket.disconnect();	
				error(401);
				close();
				reset();
			});
			socket.on('message', message);
		} else {
			error(500);
		}
	};
	service.close = function() {
		if (service.running) {
			socket.disconnect();
			close();
			reset();
		}
	}
	return service;
}]);
