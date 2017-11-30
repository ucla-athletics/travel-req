(function() {
'use strict';

var ctrl = 'TripCtrl';
angular.module('app.trips')

.controller(ctrl, function($scope, $state, logger) {
    $scope.gotoTrips = _gotoTrips;
    
	$scope.$on('$ionicView.enter', function() {
		logger.info('Enter Controller: ' + ctrl);
	});
	$scope.$on('$ionicView.leave', function() {
		logger.info('Leave Controller: ' + ctrl);
	});
    
    function _gotoTrips() {
        $state.go('app.trips');
    };
});
})();