var errorsControllers = angular.module('errorsControllers', []);

errorsControllers.controller('NetworkErrorCtrl', ['$scope', '$window', function ($scope, $window) {
	$scope.reloadApplication = function() {
		$window.location.href = '/';
	}
}]);

errorsControllers.controller('LoginErrorCtrl', ['$scope', '$window', function ($scope, $window) {
	$scope.login = function() {
		var d = new Date();
		var state = d.getTime();
		if ($window.localStorage) {
                        $window.localStorage.setItem('state', state);
                }
		$window.location.href = '/linkedin/login?state=' + state;
	}
}]);
