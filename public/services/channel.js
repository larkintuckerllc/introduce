var module = angular.module('channelServices', []);

module.service('channel', ['$http', function($http) {
	var service = {
		socket: null
	};
	service.open = function(client_id, success, error, message, close) {
		$http({method: 'GET', url: 'http://hello-channel.appspot.com/hellochannel?client_id=' + client_id}).
		success(function(data, status, headers, config) {
			var channel = new goog.appengine.Channel(data.token);
			service.socket = channel.open();
			service.socket.onopen = function() {
				success();
			};
			service.socket.onmessage = function(data) {
				message(data);
			};
			service.socket.onerror = function(data) {
				error();
			};
			service.socket.onclose = function() {
				close();
			};
		}).
		error(function(data, status, headers, config) {
			error();
		});

	};
	service.close = function() {
		service.socket.close();
	};
	return service;
}]);
