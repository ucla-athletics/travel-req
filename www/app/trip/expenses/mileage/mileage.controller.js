// mileage.ctrl.js
(function () {
	'use strict';
	var controllerId = 'MileageCtrl';
	
	angular
		.module('trip.expenses')
		.controller(controllerId, mileageController);

	mileageController.$inject = ['$scope', 'logger', 'MileageExp', 'TripSvc'];
	
	function mileageController($scope, logger, MileageExp, TripSvc) {
    
		//controller state object to connect to form object in the view
		$scope.vm = {};
		$scope.$on('modal.shown', function() {
			logger.log('Mileage Controller...');
			if (!$scope.newMileage) {
				//init a new HotelExp when adding a new hotel Expense
				$scope.newMileage = new MileageExp();
			} else {
				//grab reference to the original hotel and make a copy to work on
				$scope.original = $scope.newMileage;
				$scope.newMileage = new MileageExp($scope.original); //angular.copy($scope.original);
			}
		});

		$scope.saveNew = function() {
			//dirty check the hotel form before trying to save the expense
			var isDirty = $scope.vm.mileageForm.$dirty;
			if (isDirty) {
				logger.log('ExpensesCtrl: save new expense');
				//check for new addExpense, or existing updateExpense
				if ($scope.isNewExpense) {
					TripSvc.currentTrip.addExpense($scope.newMileage);
				} else {
					//lookup the original expense in the trip [] of expenses
					var index = TripSvc.currentTrip.expenses.indexOf($scope.original);
					if (index > -1) {
						//replace the original expense w/ newHotel
						TripSvc.currentTrip.expenses[index] = $scope.newMileage;
					}
				}
				//save the record before closing
				TripSvc.currentTrip.save();
			}
			$scope.modal.hide();			
		};
	}
})();