var meetingControllers = angular.module('meetingControllers', []);

meetingControllers.controller('MeetingCtrl', ['$scope', 'navigator', '$routeParams', 'linkedIn', 'Events', 'channel', 'Channels', 'Scannings', 'Persons', 'message', 'Introductions', 'blockUI', '$filter', function($scope, navigator, $routeParams, linkedIn, Events, channel, Channels, Scannings, Persons, message, Introductions, blockUI, $filter) {
        if (linkedIn.authenticated()) {
		blockUI.start();
		$scope.state = 'loading';
		$scope.person = {first: '', last: '', picture: 'assets/img/someone.png'};
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
			// POST SCANNING
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
					blockUI.stop();
				}
			);
		};

		var goSearching = function(_id, directly) {
			var person = Persons.get({token: linkedIn.token,
				_id: _id},
				function() {
					// SUCCESS
					if (! person.picture) {
						person.picture = 'assets/img/someone.png';
					}
					if (directly) {
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
								blockUI.stop();
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
								blockUI.stop();
							}
						);
					}
				},
				function() {
					// ERROR
					channel.close();
					$scope.state = 'error';
					blockUI.stop();
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
					blockUI.stop();
				}
			);
		};

		var goFound = function() {
			$scope.state = 'found';
			$scope.$apply();
		};

		var goMeeting = function(directly) {
			blockUI.start();
			if (directly) {
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
						blockUI.stop();
					}
				);
			} else {
				var introduction = new Introductions({event: $scope.event._id, from: $scope.person._id});
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
						blockUI.stop();
					}
				);
			}
		};

		$scope.event = Events.get({token: linkedIn.token, _id: $routeParams._id},
			function() {
				// SUCCESS
				$scope.current = ($scope.event.end >= now);
				if ($scope.current) {
					var introductionsFrom = Introductions.query(
							{token: linkedIn.token, event: $scope.event._id, from: true},
						function() {
							//SUCCESS
							var introductionsTo = Introductions.query(
									{token: linkedIn.token, event: $scope.event._id, to: true},
								function() {
									//SUCCESS
									var scannings = Scannings.query(
										{token: linkedIn.token, event: $scope.event._id},
										function() {
											// SUCCESS
											channel.open(linkedIn.person,
												function() {
													// SUCCESS
													var channelRec = new Channels({});
													channelRec.$save(
														{token: linkedIn.token},
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
														},
														function() {
															// ERROR
															channel.close();
															$scope.state = 'duplicate';
															blockUI.stop();
														}
													);
												},
												function() {
													// ERROR
													blockUI.stop();
													$scope.state = 'error';
													$scope.$apply();
												},
												function(data) {
													// MESSAGE
													var message = angular.fromJson(data.data);
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
										},
										function() {
											// ERROR
											navigator.navigate('/network-error');
											blockUI.stop();
										}
									);
								},
								function() {
									// ERROR
									navigator.navigate('/network-error');
									blockUI.stop();
								}
							);
						},
						function() {
							// ERROR
							navigator.navigate('/network-error');
							blockUI.stop();
						}
					);
				} else {
					navigator.navigate('/events/' + $scope.event._id);
					blockUI.stop();
				}
			},
			function(res) {
				// ERROR
				if (res.status == 401) {
					linkedIn.logout();
					navigator.navigate('/login');
					blockUI.stop();
				} else {
					navigator.navigate('/network-error');
					blockUI.stop();
				}
			}
		);
        } else {
                navigator.navigate('/login');
        }
}]);
