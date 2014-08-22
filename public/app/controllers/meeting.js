var meetingControllers = angular.module('meetingControllers', []);

meetingControllers.controller('MeetingCtrl', ['$scope', 'navigator', '$routeParams', 'linkedIn', 'Events', 'channel', 'Scannings', 'Persons', 'message', 'Introductions', 'blockUI', '$filter', function($scope, navigator, $routeParams, linkedIn, Events, channel, Scannings, Persons, message, Introductions, blockUI, $filter) {
	blockUI.start();
        if (linkedIn.authenticated()) {
		$scope.state = 'loading';
		$scope.person = {};
		var d = new Date();
		var now = d.getTime();
		$scope.current = true;
		$scope.cancel = function() {
			navigator.navigate('/events/' + $scope.event._id);
		};
		var scanning = null;

		var findScanningPerson = function(scannings, introductionsFrom, introductionsTo) {
			var found = false;
			scannings = $filter('orderBy')(scannings, 'order', true); 
			for (var i = 0; i < scannings.length; i++) {
				found = scannings[i]._id;
				for (var j = 0; j < introductionsFrom.length; j++) {
					if (introductionsFrom[j].to == found) {
						found = false;
					}	
				}
				for (var k = 0; k < introductionsTo.length; k++) {
					if (introductionsTo[k].from == found) {
						found = false;
					}	
				}
			}	
			return found;
		};

		var goScanning = function() {
			blockUI.start();
			scanning = new Scannings({event: $scope.event._id});
			scanning.$save(
				{token: linkedIn.token},
				function() {
					// SUCCESS
					$scope.state = 'scanning';
					blockUI.stop();
				},
				function() {
					// ERROR
					channel.close();
					$scope.state = 'error';
					blockUI.reset();
				}
			);
		};

		var goSearching = function(_id, directly) {
			blockUI.start();
			var person = Persons.get({token: linkedIn.token,
				_id: _id},
				function() {
					// SUCCESS
					if (directly) {
						blockUI.start();
						message.searching(person._id,
							function() {
								// SUCCESS
								$scope.person = person;
								$scope.state = 'searching';
								blockUI.stop();
							},
							function() {
								// ERROR
								channel.close();
								$scope.state = 'error';
								blockUI.reset();
							}
						);
					} else {
						blockUI.start();
						scanning.$delete({token: linkedIn.token},
							function() {
								// SUCCESS
								$scope.person = person;
								$scope.state = 'searching';
								blockUI.stop();
							},
							function() {
								// ERROR
								channel.close();
								$scope.state = 'error';
								blockUI.reset();
							}
						);
					}
					blockUI.stop();
				},
				function() {
					// ERROR
					channel.close();
					$scope.state = 'error';
					blockUI.reset();
				}
			);
		};

		var goWaiting = function() {
			blockUI.start();
			message.found($scope.person._id,
				function() {
					// SUCCESS
					$scope.state = 'waiting';
					blockUI.stop();
				},
				function() {
					// ERROR
					channel.close();
					$scope.state = 'error';
					blockUI.reset();
				}
			);
		};

		var goFound = function() {
			$scope.state = 'found';
		};

		var goMeeting = function(directly) {
			if (directly) {
				blockUI.start();
				message.meeting($scope.person._id,
					function() {
						// SUCCESS
						channel.close();
						$scope.state = 'meeting';
						blockUI.stop();
					},
					function() {
						// ERROR
						channel.close();
						$scope.state = 'error';
						blockUI.reset();
					}
				);
			} else {
				var introduction = new Introductions({event: $scope.event._id, from: $scope.person._id});
				blockUI.start();
				introduction.$save(
					{token: linkedIn.token},
					function() {
						// SUCCESS
						channel.close();
						$scope.state = 'meeting';
						blockUI.stop();
					},
					function() {
						// ERROR
						channel.close();
						$scope.state = 'error';
						blockUI.reset();
					}
				);
			}
		};

		blockUI.start();
		$scope.event = Events.get({token: linkedIn.token, _id: $routeParams._id},
			function() {
				// SUCCESS
				$scope.current = ($scope.event.end >= now);
				if ($scope.current) {

// INDENT
blockUI.start();
var introductionsFrom = Introductions.query(
	{token: linkedIn.token, event: $scope.event._id, from: true},
	function() {
		//SUCCESS
		blockUI.start();
		var introductionsTo = Introductions.query(
			{token: linkedIn.token, event: $scope.event._id, to: true},
			function() {
				//SUCCESS
				blockUI.start();
				var scannings = Scannings.query(
					{token: linkedIn.token, event: $scope.event._id},
					function() {

	// INDENT
	// SUCCESS
	blockUI.start();
	channel.open(linkedIn.person,
		function() {
			// SUCCESS
			$scope.cancel = function() {
				channel.close();
				navigator.navigate('/events/' + $scope.event._id);
			};
			$scope.found = function() {
				if ($scope.state != 'found') {
					goWaiting();	
				} else {
					goMeeting(true);
				}
			};
			var scanningPerson = findScanningPerson(scannings, introductionsFrom, introductionsTo); 
			if (scanningPerson) {
				goSearching(scanningPerson, true);
			} else {
				goScanning();
			} 
			blockUI.stop();
		},
		function() {
			// ERROR
			$scope.state = 'error';
			blockUI.reset();
		},
		function(data) {
			// MESSAGE
			var message = angular.fromJson(data);
			if (message.state == 'searching') {
				goSearching(message.person, false);
			} 
			if ((message.state == 'found') && (message.person == $scope.person._id)) {
				goFound();
			} 
			if ((message.state == 'meeting') && (message.person == $scope.person._id)) {
				goMeeting(false);
			}
		},
		function() {
			// CLOSE
			$scope.cancel = function() {
				navigator.navigate('/events/' + $scope.event._id);
			};
		}
	);
	blockUI.stop();
	// INDENT END
					},
					function() {
						// ERROR
						navigator.navigate('/network-error');
						blockUI.reset();
					}
				);
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
	function() {
		// ERROR
		navigator.navigate('/network-error');
		blockUI.reset();
	}
);
blockUI.stop();
// INDENT END

				} else {
					navigator.navigate('/events/' + $scope.event._id);
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
