var indexControllers = angular.module('indexControllers', []);

indexControllers.controller('IndexHomeCtrl', ['$scope', 'navigator', 'linkedIn', 'Events', '$filter', 'blockUI', function ($scope, navigator, linkedIn, Events, $filter, blockUI) {
	blockUI.start();	
	if (linkedIn.authenticated()) {
		$scope.menuOpen = false;
		$scope.navigate = navigator.navigate;
		$scope.toggleMenu = function() {
			$scope.menuOpen = ! $scope.menuOpen;
		};
		$scope.logout = function() {
			linkedIn.logout();
			navigator.navigate('/login');	
		};
		var d = new Date();
		var now = d.getTime();
		$scope.currentEvents = [];
		$scope.futureEvents = [];
		var events = Events.query(
			{token: linkedIn.token, min_end: now},	
			function() {
				// SUCCESS
				$scope.currentEvents = $filter('filter')(events, function(event) { return event.start <= now });
				$scope.futureEvents = $filter('filter')(events, function(event) { return event.start > now });
				blockUI.stop();
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
		$scope.events = events;
	} else {
		navigator.navigate('/login');	
		blockUI.stop();
	}
}]);

indexControllers.controller('IndexAboutCtrl', ['$scope', 'navigator', 'linkedIn', function($scope, navigator,  linkedIn) {
        if (linkedIn.authenticated()) {
		$scope.navigate = navigator.navigate;
        } else {
                navigator.navigate('/login');
        }
}]);
