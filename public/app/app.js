var myApp = angular.module('myApp', [
	'ngRoute',
	'blockUI',
	'navigatorServices',
	'linkedInServices',
	'restfulServices',
	'channelServices',
	'messageServices',
	'errorsControllers',
	'indexControllers',
	'eventsControllers',
	'meetingControllers',
	'organizerControllers'
])
.config(function(blockUIConfigProvider) {
	blockUIConfigProvider.autoBlock(false);
});
