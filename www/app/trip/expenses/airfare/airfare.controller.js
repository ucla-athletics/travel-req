(function() {
	'use strict';

	var ctrl = 'AirfareCtrl';
	angular.module('trip.expenses')

	.controller(ctrl, function($scope, logger, AirfareExp, TripSvc) {    
		//controller state object to connect to form object in the view
		$scope.vm = {};
		$scope.$on('modal.shown', function() {
			logger.log('Airfare Controller...');
			if (!$scope.newAirfare) {
				$scope.newAirfare = new AirfareExp();
			} else {
				//grab reference to the original hotel and make a copy to work on
				$scope.original = $scope.newAirfare;
				$scope.newAirfare = angular.copy($scope.original);
			}
		});

		$scope.saveNew = function() {
			//dirty check the airfare form before trying to save the expense
			var isDirty = $scope.vm.airfareForm.$dirty;
			if (isDirty) {
				logger.log('ExpensesCtrl: save Airfare expense');
				//check for new addExpense, or existing updateExpense
				if ($scope.isNewExpense) {
					TripSvc.currentTrip.addExpense($scope.newAirfare);
				} else {
					//lookup the original expense in the trip [] of expenses
					var index = TripSvc.currentTrip.expenses.indexOf($scope.original);
					if (index > -1) {
						//replace the original expense w/ newHotel
						TripSvc.currentTrip.expenses[index] = $scope.newAirfare;
					}
				}
				//TripSvc.pause();
				TripSvc.currentTrip.save();
			}
			$scope.modal.hide();
		};

		$scope.saveAirfare = function() {        
			logger.log('save updates to expense: ' + $scope.newAirfare);
		};

		$scope.addReceipt = function() {
			logger.log('add a receipt for this expense: ' + $scope.newAirfare);
		};

	});
})();