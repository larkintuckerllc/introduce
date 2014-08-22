var organizerControllers = angular.module('organizerControllers', []);

organizerControllers.controller('OrganizerCtrl', ['$scope', 'navigator', '$routeParams', 'linkedIn', 'Events', 'blockUI', 'Introductions', 'Persons', function($scope, navigator, $routeParams, linkedIn, Events, blockUI, Introductions, Persons) {
	blockUI.start();
        if (linkedIn.authenticated()) {
		var d = new Date();
		var now = d.getTime();
		$scope.navigate = navigator.navigate;
		$scope.event = null;	
		$scope.current = true;
		var participationIndex = [];
		$scope.participation = [];
		$scope.personLookup = {};
		blockUI.start();
		$scope.event = Events.get({token: linkedIn.token, _id: $routeParams._id}, 
			function() {
				// SUCCESS
				$scope.current = ($scope.event.end >= now);
				blockUI.start();
				var introductions = Introductions.query(
					{token: linkedIn.token, event: $scope.event._id},
					function() {
						// SUCCESS
						var participationIndexPosition;
						for (var i = 0; i < introductions.length; i++) {
							participationIndexPosition = participationIndex.indexOf(introductions[i].from);
							if (participationIndexPosition == -1) {
								participationIndex.push(introductions[i].from);
								$scope.participation.push({person: introductions[i].from, count: 1});
								blockUI.start();
								$scope.personLookup[introductions[i].from] = Persons.get(
									{token: linkedIn.token, _id: introductions[i].from},
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
							} else {
								$scope.participation[participationIndexPosition].count += 1;
							}
							participationIndexPosition = participationIndex.indexOf(introductions[i].to);
							if (participationIndexPosition == -1) {
								participationIndex.push(introductions[i].to);
								$scope.participation.push({person: introductions[i].to, count: 1});
								blockUI.start();
								$scope.personLookup[introductions[i].to] = Persons.get(
									{token: linkedIn.token, _id: introductions[i].to},
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
							} else {
								$scope.participation[participationIndexPosition].count += 1;
							}
						}	
						blockUI.stop();
					},
					function() {
						// ERROR
						navigator.navigate('/network-error');
						blockUI.reset();
					}
				);
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




