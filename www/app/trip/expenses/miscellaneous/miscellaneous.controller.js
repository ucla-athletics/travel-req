// miscellaneous.ctrl.js
(function () {
	'use strict';
	var controllerId = 'MiscellaneousCtrl';
	
	angular
		.module('trip.expenses')
		.controller(controllerId, miscellaneousController);

	miscellaneousController.$inject = ['$scope', 'logger', 'MiscExp', 'MiscSvc', 'TripSvc'];
	
	function miscellaneousController($scope, $log, MiscExp, MiscSvc, TripSvc) {    
		//controller state object to connect to form object in the view
		$scope.vm = {};
		$scope.$on('modal.shown', function() {
			$log.log('Misc Controller...');
			if (!$scope.newMisc) {
				//init a new HotelExp when adding a new Misc Expense
				$scope.newMisc = new MiscExp();
			} else {
				//grab reference to the original Misc and make a copy to work on
				$scope.original = $scope.newMisc;
				$scope.newMisc = new MiscExp($scope.original);
			}
		});

		$scope.saveNew = function() {
			//dirty check the misc form before trying to save the expense
			var isDirty = $scope.vm.miscForm.$dirty;
			if (isDirty) {
				$log.log('MiscCtrl: save new expense');
				//check for new addExpense, or existing updateExpense
				if ($scope.isNewExpense) {
					TripSvc.currentTrip.addExpense($scope.newMisc);
				} else {
					//lookup the original expense in the trip [] of expenses
					var index = TripSvc.currentTrip.expenses.indexOf($scope.original);
					if (index > -1) {
						//replace the original expense w/ newMisc
						TripSvc.currentTrip.expenses[index] = $scope.newMisc;
					}
				}
				//save the record before closing
				TripSvc.currentTrip.save();
			}
			$scope.modal.hide();			
		};
    
	}
})();