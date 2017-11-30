// transportation.ctrl.js
(function () {
	'use strict';
	var controllerId = 'TransportationCtrl';
	
	angular
		.module('trip.expenses')
		.controller(controllerId, transportationController);

	transportationController.$inject = ['$scope', 'logger', 'TransportationExp', 'TripSvc'];
	
	function transportationController($scope, logger, TransportationExp, TripSvc) {
    
		$scope.vm = [];
		$scope.$on('modal.shown', function() {
			logger.log('Transportation Controller...');
			if (!$scope.newTransportation) {
				//init a new TransportationExp when adding a new ground Expense
				$scope.newTransportation = new TransportationExp();
			} else {
				//grab reference to the original transportation and make a copy to work on
				$scope.original = $scope.newTransportation;
				$scope.newTransportation = angular.copy($scope.original);
			}
		});

		$scope.saveNew = function() {
			//dirty check the hotel form before trying to save the expense
			var isDirty = $scope.vm.transportationForm.$dirty;
			if (isDirty) {
				logger.log('TransportationCtrl: save new expense');
				//check for new addExpense, or existing updateExpense
				if ($scope.isNewExpense) {
					TripSvc.currentTrip.addExpense($scope.newTransportation);
				} else {
					//lookup the original expense in the trip [] of expenses
					var index = TripSvc.currentTrip.expenses.indexOf($scope.original);
					if (index > -1) {
						//replace the original expense w/ newHotel
						TripSvc.currentTrip.expenses[index] = $scope.newTransportation;
					}
				}
				//save the record before closing
				TripSvc.currentTrip.save();
			}
			$scope.modal.hide();			
		}
	}
})();