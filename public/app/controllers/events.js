var eventsControllers = angular.module('eventsControllers', []);

eventsControllers.controller('EventsCtrl', ['$scope', 'navigator', '$routeParams', 'linkedIn', 'Events', 'Introductions', 'Persons', 'blockUI', 'Organizers', function($scope, navigator, $routeParams, linkedIn, Events, Introductions, Persons, blockUI, Organizers) {
	blockUI.start();
        if (linkedIn.authenticated()) {
		var d = new Date();
		var now = d.getTime();
		$scope.navigate = navigator.navigate;
		$scope.event = null;	
		$scope.current = true;
		$scope.persons = [];
		$scope.organizers = [];
		$scope.isOrganizer = false;
		blockUI.start();
		$scope.event = Events.get({token: linkedIn.token, _id: $routeParams._id}, 
			function() {
				// SUCCESS
				$scope.current = ($scope.event.end >= now);
				if ($scope.current) {
					blockUI.start();
					var organizers = Organizers.query(
						{token: linkedIn.token, event: $scope.event._id},
						function() {
							// SUCCESS
							for (var i = 0; i < organizers.length; i++) {
								if (organizers[i].person == linkedIn.person) {
									$scope.isOrganizer = true;
								}
								blockUI.start();
								$scope.organizers.push(Persons.get(
									{token: linkedIn.token, _id: organizers[i].person},
									function() {
										// SUCCESS
										blockUI.stop();
									},
									function() {
										// ERROR
										navigator.navigate('/network-error');
										blockUI.reset();
									}
								));
							}
							blockUI.stop();
						},
						function() {
							// ERROR
							navigator.navigate('/network-error');
							blockUI.reset();
						}
					);
					blockUI.start();
					var introductionsTo = Introductions.query(
						{token: linkedIn.token, event: $scope.event._id, to: true},
						function() {
							// SUCCESS
							for (var i = 0; i < introductionsTo.length; i++) {
								blockUI.start();
								$scope.persons.push(Persons.get(
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
								));
							}	
							blockUI.stop();
						},
						function() {
							// ERROR
							navigator.navigate('/network-error');
							blockUI.reset();
						}
					);
					blockUI.start();
					var introductionsFrom = Introductions.query(
						{token: linkedIn.token, event: $scope.event._id, from: true},
						function() {
							// SUCCESS
							for (var i = 0; i < introductionsFrom.length; i++) {
								blockUI.start();
								$scope.persons.push(Persons.get(
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
								));
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
				} else {
					navigator.navigate('/network-error');
				}
				blockUI.reset();
			}
		);	
		blockUI.stop();
        } else {
                navigator.navigate('/login');
		blockUI.reset();
        }
}]);
