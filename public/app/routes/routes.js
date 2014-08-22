angular.module('myApp').config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/', {
      	  		templateUrl: 'views/index-home.html',
       			controller: 'IndexHomeCtrl'
      		}).
		when('/network-error', {
      	  		templateUrl: 'views/errors-network.html',
       			controller: 'NetworkErrorCtrl'
      		}).
		when('/login', {
      	  		templateUrl: 'views/errors-login.html',
       			controller: 'LoginErrorCtrl'
		}).
		when('/about', {
      	  		templateUrl: 'views/index-about.html',
       			controller: 'IndexAboutCtrl'
		}).
     		when('/events/:_id', {
       			templateUrl: 'views/events.html',
			controller: 'EventsCtrl'
      		}).
     		when('/organizer/:_id', {
       			templateUrl: 'views/organizer.html',
			controller: 'OrganizerCtrl'
      		}).
     		when('/meeting/:_id', {
       			templateUrl: 'views/meeting.html',
			controller: 'MeetingCtrl'
      		}).
      		otherwise({
       			redirectTo: '/'
      		});
}]);
