var module = angular.module('messageServices', []);

module.service('message', ['$http', 'linkedIn', function($http, linkedIn) {
	var service = {
	};
	service.searching = function(person, success, error) {
		$http({method: 'GET', url: '/messages/searching?token=' + linkedIn.token + '&person=' + person}).
		success(function(data, status, headers, config) {
			success();
		}).
		error(function(data, status, headers, config) {
			error();
		});

	};

	service.found = function(person, success, error) {
		$http({method: 'GET', url: '/messages/found?token=' + linkedIn.token + '&person=' + person}).
		success(function(data, status, headers, config) {
			success();
		}).
		error(function(data, status, headers, config) {
			error();
		});
	};

	service.meeting = function(person, success, error) {
		$http({method: 'GET', url: '/messages/meeting?token=' + linkedIn.token + '&person=' + person}).
		success(function(data, status, headers, config) {
			success();
		}).
		error(function(data, status, headers, config) {
			error();
		});
	};

	service.cancel= function(person, success, error) {
		$http({method: 'GET', url: '/messages/cancel?token=' + linkedIn.token + '&person=' + person}).
		success(function(data, status, headers, config) {
			success();
		}).
		error(function(data, status, headers, config) {
			error();
		});
	};
	
	return service;
}]);
