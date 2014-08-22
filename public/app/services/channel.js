var module = angular.module('channelServices', []);

module.service('channel', ['$http', function($http) {
	var service = {
	};
	var running =  false;
	var _id;
	var token;
	var error;
	var message;
	var close;
	var reset = function() {
		running = false;
		_id = null;
		token = null;
		error = null;
		message = null;
		close = null;
	}
	var reopen = function() {
		$http({method: 'GET', url: 'http://introduce.solutions:3001/open/' + _id + '?token=' + token}).
		success(function(data, status, headers, config) {
			if (data.close) {
				close();
				reset();
			} else {
				if (data.data) {
					message(data.data);
				}
				reopen();
			}
		}).
		error(function(data, status, headers, config) {
			error();
			close();
			reset();
		});
	};
	service.open = function(p__id, success, p_error, p_message, p_close) {
		_id = p__id;
		error = p_error;
		message = p_message;
		close = p_close;
		if (!running) {
			$http({method: 'GET', url: 'http://introduce.solutions:3001/open/' + _id}).
			success(function(data, status, headers, config) {
				running = true;
				token = data.token;
				success();
				if (data.close) {
					close();
					reset();
				} else {
					if (data.data) {
						message(data.data);
					}
					reopen();
				}
			}).
			error(function(data, status, headers, config) {
				error();
				reset();
			});
		} else {
			error();
		}
	};
	service.close = function() {
		if (running) {
			$http({method: 'GET', url: 'http://introduce.solutions:3001/close/' + _id + '?token=' + token});
		}
	}
	return service;
}]);
