var module = angular.module('linkedInServices', []);
module.service('linkedIn', ['$window', '$http', function($window, $http) {
	var service = {
		token: null,
		person: null
	};
	if ($window.localStorage) {
		service.token = $window.localStorage.getItem('token');	
		service.person = $window.localStorage.getItem('person');	
	}
	service.authenticated = function() {
		return (service.token != null); 
	};
	service.login = function(token, person) {
		if ($window.localStorage) {
			service.token = token;
			service.person = person;
			$window.localStorage.setItem('token', token);
			$window.localStorage.setItem('person', person);
		}
	};
	service.logout = function() {
		if ($window.localStorage) {
			service.token = null;
			service.person = null;
			$window.localStorage.removeItem('token');
			$window.localStorage.removeItem('person');
		}
	};
	return service;
}])
.run(function ($location, $window, linkedIn) {
	var token = $location.search().token;
	var person = $location.search().person;
	var state = $location.search().state;
	$location.search('token', null);
	$location.search('person', null);
     	$location.search('state', null);
	if (token) {
		if ($window.localStorage) {
			var storedState = $window.localStorage.getItem('state');
			$window.localStorage.removeItem('state');
			if (state == storedState) {
				linkedIn.login(token, person);
			}
		}
	}
});
