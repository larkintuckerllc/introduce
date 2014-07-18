var eventsControllers = angular.module('eventsControllers', []);

eventsControllers.controller('EventsCtrl', ['$scope', 'navigator', '$routeParams', 'linkedIn', 'Events', 'Introductions', 'Persons', 'blockUI', function($scope, navigator, $routeParams, linkedIn, Events, Introductions, Persons, blockUI) {
	blockUI.start();
        if (linkedIn.authenticated()) {
		var d = new Date();
		var now = d.getTime();
		$scope.navigate = navigator.navigate;
		$scope.event = null;	
		$scope.current = true;
		$scope.persons = [];
		$scope.event = Events.get({token: linkedIn.token, _id: $routeParams._id}, 
			function() {
				// SUCCESS
				$scope.current = ($scope.event.end >= now);
				if ($scope.current) {
					blockUI.start();
					var introductionsTo = Introductions.query(
						{token: linkedIn.token, event: $scope.event._id, to: true},
						function() {
							// SUCCESS
							for (var i = 0; i < introductionsTo.length; i++) {
								blockUI.start();
								$scope.persons.push({});
								$scope.persons[$scope.persons.length - 1] = Persons.get(
									{token: linkedIn.token, _id: introductionsTo[i].from},
									function() {
										// SUCCESS
										blockUI.stop();
									},
									function() {
										// ERROR
										navigator.navigate('/network-error');
										blockUI.reset();
									}
								);
							}	
							blockUI.stop();
						},
						function() {
							// ERROR
							navigator.navigate('/network-error');
							blockUI.reset();
						}
					);
				}
				if ($scope.current) {
					blockUI.start();
					var introductionsFrom = Introductions.query(
						{token: linkedIn.token, event: $scope.event._id, from: true},
						function() {
							// SUCCESS
							for (var i = 0; i < introductionsFrom.length; i++) {
								blockUI.start();
								$scope.persons.push({});
								$scope.persons[$scope.persons.length - 1] = Persons.get(
									{token: linkedIn.token, _id: introductionsFrom[i].to},
									function(person) {
										// SUCCESS
										blockUI.stop();
									},
									function() {
										// ERROR
										navigator.navigate('/network-error');
										blockUI.reset();
									}
								);
							}	
							blockUI.stop();
						},
						function() {
							// ERROR
							navigator.navigate('/network-error');
							blockUI.reset();
						}
					);
				}
				blockUI.stop();
			},
			function(res) {
				// ERROR
				if (res.status == 401) {
					linkedIn.logout();
					navigator.navigate('/login');
					blockUI.reset();
				} else {
					navigator.navigate('/network-error');
					blockUI.reset();
				}
			}
		);	
        } else {
                navigator.navigate('/login');
        }
}]);
