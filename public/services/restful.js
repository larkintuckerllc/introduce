var restfulServices = angular.module('restfulServices', ['ngResource']);

restfulServices.factory('Channels', ['$resource', function($resource){
	return $resource('channels/:_id',{},{
		delete: {method: 'DELETE', params: {_id:'@_id'}}
	});
}]);

restfulServices.factory('Events', ['$resource', function($resource){
	return $resource('events/:_id',{},{
		delete: {method: 'DELETE', params: {_id:'@_id'}}
	});
}]);

restfulServices.factory('Introductions', ['$resource', function($resource){
	return $resource('introductions/:_id',{},{
		delete: {method: 'DELETE', params: {_id:'@_id'}}
	});
}]);

restfulServices.factory('Persons', ['$resource', function($resource){
	return $resource('persons/:_id',{},{
		delete: {method: 'DELETE', params: {_id:'@_id'}}
	});
}]);

restfulServices.factory('Scannings', ['$resource', function($resource){
	return $resource('scannings/:_id',{},{
		delete: {method: 'DELETE', params: {_id:'@_id'}}
	});
}]);
