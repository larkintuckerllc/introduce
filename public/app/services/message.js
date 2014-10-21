var module = angular.module('messageServices', []);

module.service('message', ['$http', 'linkedIn', function($http, linkedIn) {
	var service = {
	};
	function send(path, person, success, error) {
		$http({method: 'GET', url: path + '?token=' + linkedIn.token + '&person=' + person}).
		success(function(data, status, headers, config) {
			success();
		}).
		error(function(data, status, headers, config) {
			error();
		});
	}

	service.searching = function(person, success, error) {
		send('/messages/searching', person, success, error);
	};

	service.ping = function(person, success, error) {
		send('/messages/ping', person, success, error);
	};

	service.found = function(person, success, error) {
		send('/messages/found', person, success, error);
	};

	service.meeting = function(person, success, error) {
		send('/messages/meeting', person, success, error);
	};

	service.cancel= function(person, success, error) {
		send('/messages/cancel', person, success, error);
	};
	
	return service;
}]);
