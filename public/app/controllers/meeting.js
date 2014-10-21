var meetingControllers = angular.module('meetingControllers', []);

meetingControllers.controller('MeetingCtrl', ['$scope', 'navigator', '$routeParams', 'linkedIn', 'Events', 'channel', 'Scannings', 'Persons', 'message', 'Introductions', 'blockUI', '$filter', '$timeout', function($scope, navigator, $routeParams, linkedIn, Events, channel, Scannings, Persons, message, Introductions, blockUI, $filter, $timeout) {
	blockUI.start();
        if (linkedIn.authenticated()) {
		$scope.state = 'loading';
		$scope.person = null;
		var d = new Date();
		var now = d.getTime();
		$scope.current = true;
		var scanning = null;
		$scope.pinging = false;
		$scope.pinged = false;
		$scope.cancel = function() {
			switch($scope.state) {
				case 'scanning':
					channel.close();
					navigator.navigate('/events/' + $scope.event._id);
					break;
				case 'searching':
				case 'waiting':
				case 'found':
					channel.close();
					blockUI.start();
					message.cancel($scope.person._id,
						function() {
							// SUCCESS
							blockUI.stop();
							navigator.navigate('/events/' + $scope.event._id);
						},
						function() {
							// ERROR
							blockUI.reset();
							navigator.navigate('/events/' + $scope.event._id);
						}
					);
					break;
				default:
					navigator.navigate('/events/' + $scope.event._id);
			}
		};
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

		$scope.ping = function() {
			if (!$scope.pinging) {
				$scope.pinging = true;
				$timeout(function() {
					$scope.pinging = false;
				}, 5000);
				message.ping($scope.person._id,
					function() {
						// SUCCESS
					},
					function() {
						// ERROR
					}
				);
			}
		}

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
			$scope.$apply();
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

		$scope.found = function() {
			if ($scope.state != 'found') {
				goWaiting();	
			} else {
				goMeeting(true);
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
			var scanningPerson = findScanningPerson(scannings, introductionsFrom, introductionsTo); 
			if (scanningPerson) {
				goSearching(scanningPerson, true);
			} else {
				goScanning();
			} 
			blockUI.stop();
		},
		function(status) {
			// ERROR
			if (status == 401) {
				$scope.state = 'duplicate';
				$scope.$apply();
			} else {
				$scope.state = 'error';
				$scope.$apply();
			} 
			blockUI.reset();
		},
		function(data) {
			// MESSAGE
			var message = angular.fromJson(data);
			if (($scope.state == 'scanning') && (message.state == 'searching')) {
				goSearching(message.person, false);
			} 
			if (($scope.state == 'searching') && (message.state == 'found') && (message.person == $scope.person._id)) {
				goFound();
			} 
			if (($scope.state == 'waiting') && (message.state == 'meeting') && (message.person == $scope.person._id)) {
				goMeeting(false);
			}
			if ((message.state == 'cancel') && (message.person == $scope.person._id)) {
				channel.close();
				$scope.state = 'cancel';
				$scope.$apply();
			}
			if ((message.ping) && (message.person == $scope.person._id)) {
				if (!$scope.pinged) {
					$scope.pinged = true;
					$scope.$apply();
					$timeout(function() {
						$scope.pinged = false;
					}, 5000);
				}
			}
		},
		function() {
			// CLOSE
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
