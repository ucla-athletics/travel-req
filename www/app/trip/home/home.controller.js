(function() {
	'use strict';

	var ctrl = 'HomeCtrl';
	angular.module('trip.home')

	.controller('HomeCtrl', function($scope, $rootScope, logger, $timeout, $ionicPopup, $state
										 , TripSvc) {
		$scope.vm = {};
		$scope.tripSvc = TripSvc;
		$scope.addDestination = _toggleSubmitted;
//		$scope.sendTrip = _sendTrip;
		$scope.gotoTrips = _gotoTrips;
//        $scope.test = function() { console.log('testing debounce'); };

		$scope.$on('$ionicView.enter', function(event, data) {
			logger.info(ctrl + '_enter');
		});
		$scope.$on('$ionicView.leave', function(event, data) {
			logger.info(ctrl + '_leave');
			_formLeave();
		});

//		$scope.$on('$destroy', function() {
////			_formLeave();
//		});
		
		function _formLeave() {
			var isDirty = $scope.vm.tripForm.$dirty;
			if (isDirty) { 
				_save().then(function(isSaved) {
					//reset the form to pristine after a successful save
					$scope.vm.tripForm.$setPristine();
				}); 
			}
		}

		function _save() {
			//use the trip service to save the current trip to database
			return TripSvc.saveTrip(TripSvc.currentTrip)
			.then(function(result) {
				logger.info('Trip save: ' + result);
				return true;
			}).catch(function(err) {
				logger.error(err);
				return false;
			});
		}

		function _toggleSubmitted() {
			TripSvc.currentTrip.isSubmitted = !TripSvc.currentTrip.isSubmitted;
		}

		function _gotoTrips() {
			$state.go('app.trips');
		};

		function _addDestination() {
			// An elaborate, custom popup
			var myPopup = $ionicPopup.show({
				template: '<input type="text" ng-model="vm.destination">',
				title: 'Enter Wi-Fi Password',
				subTitle: 'Please use normal things',
				scope: $scope,
				buttons: [
					{ text: 'Cancel' },
					{ text: '<b>Save</b>',
					type: 'button-positive',
					onTap: function(e) {
						if (!$scope.vm.destination) {
						//don't allow the user to close unless he enters wifi password
						e.preventDefault();
					} else {
						return $scope.vm.destination;
					}}
				}]
			});

			myPopup.then(function(res) {
				console.log('Tapped!', res);
				var d = { id: TripSvc.currentTrip.destinations.length + 1, title: res };
				TripSvc.currentTrip.destinations.push(d);
			});
	//        $timeout(function() {
	//            myPopup.close(); //close the popup after 3 seconds for some reason
	//        }, 3000);
		};
	});
})();