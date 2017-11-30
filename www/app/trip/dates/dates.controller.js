(function() {
	'use strict';

	var ctrl = 'DatesCtrl';
	angular.module('trip.dates')

	.controller(ctrl, function($scope, logger, $ionicModal, $cordovaDatePicker, TravelDate, TripSvc) {
		$scope.vm = {};
		// use tripSvc to access currentTrip and collection of travel dates
		$scope.tripSvc = TripSvc;
	//PUBLIC METHODS
		$scope.showTravelDateModal = _showTravelDateModal;
		$scope.addTravelDate = _addTravelDate;
		$scope.saveNew = _saveTravelDate;
		$scope.deleteTravelDate = _deleteTravelDate;
		$scope.closeModal = _closeModal;
	//VIEW EVENTS: enter, leave
		$scope.$on('$ionicView.enter', function(event, data) {
			logger.info(ctrl + '_enter');
		});	
		$scope.$on('$ionicView.leave', function(event, data) {
			logger.info(ctrl + '_leave');
		});
	//MODAL EVENTS: shown
		$scope.$on('modal.shown', function() {
			logger.log('DatesCtrl Controller... ');
			if (!$scope.newTravelDate) {
				//init a new HotelExp when adding a new hotel Expense
				$scope.newTravelDate = new TravelDate();
			} else {
				//grab reference to the original hotel and make a copy to work on
				$scope.original = $scope.newTravelDate;
				$scope.newTravelDate = angular.copy($scope.original);
			}
		});

		function _saveTravelDate() {
			//dirty check the travelDate form before trying to save the TravelDate
			var isDirty = $scope.vm.dateForm.$dirty;
			if (isDirty) {
				logger.log('DatesCtrl: save new travel date');
				//check for new addTravelDate, or existing updateTravelDate
				if ($scope.isNewTravelDate) {
					TripSvc.currentTrip.addTravelDate($scope.newTravelDate);
				} else {
					//lookup the original TravelDate in the trips travelDates[]
					var index = TripSvc.currentTrip.travelDates.indexOf($scope.original);
					if (index > -1) {
						//replace the original travelDates w/ newTravelDate
						TripSvc.currentTrip.travelDates[index] = $scope.newTravelDate;
					}
				}
				//save the record before closing
				TripSvc.currentTrip.save();
			}
			$scope.modal.hide();			
		};

		function _deleteTravelDate(d) {
			TripSvc.currentTrip.deleteTravelDate(d);
		}

		function _showTravelDateModal(d) {
			if (!d) { 
				$scope.isNewTravelDate = true;
			} else $scope.isNewTravelDate = false;

			$scope.newTravelDate = d;
			_loadTravelDateModal();
		}

		function _addTravelDate() {
			_showTravelDateModal();
		}
	//MODAL LOAD AND CLOSE				
		function _loadTravelDateModal() {
			$ionicModal.fromTemplateUrl('app/trip/dates/date.modal.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function(modal) {
				$scope.modal = modal;
				modal.show();
			});
		}

		function _closeModal() {
			$scope.newTravelDate = null;
			$scope.modal.hide();
		};
		//Cleanup the modal when we're done with it!
		$scope.$on('$destroy', function() {
			$scope.modal.remove();
		});
		// Execute action on hide modal
		$scope.$on('modal.hidden', function() {
			// Execute action
		});
		// Execute action on remove modal
		$scope.$on('modal.removed', function() {
			// Execute action
		});        
	});
})();