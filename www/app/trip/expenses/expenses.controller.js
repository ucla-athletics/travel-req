(function() {
'use strict';

var ctrl = 'ExpensesCtrl';
angular.module('trip.expenses')

.controller(ctrl, function($scope, $state, $timeout, $ionicActionSheet, $ionicModal, $ionicPopup
							, logger, AirfareExp, HotelExp, TripSvc, ReportSvc, EmailSvc) {
    $scope.expenseTypes = ['Airfare','Hotel','Ground','Mileage','Meals','Miscellaneous'];
    $scope.tripSvc = TripSvc;
    $scope.expenses = [];
    $scope.isNewExpense = false;
    
    $scope.addExpenseSheet = _addExpenseSheet;    
    $scope.showExpenseModal = _showExpenseModal;
//    $scope.sendTrip = _sendTrip;
    $scope.modals = [];
	
	$scope.$on('$ionicView.enter', function(event, data) {
		logger.info(ctrl + '_enter');
	});	
	$scope.$on('$ionicView.leave', function(event, data) {
		logger.info(ctrl + '_leave');
	});

    $scope.cancelNew = function() {
        console.log('ExpensesCtrl: cancel new expense');
        $scope.modal.hide();
    };
    $scope.deleteExpense = function(exp) {
        TripSvc.currentTrip.deleteExpense(exp);
        //moved the save call to the trip object
        //TripSvc.pause();
    };
    //
    // Modal event model: destroy, hide and remove
    //
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.expenseModal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function() {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });
    
    function _addExpenseSheet() {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: 'Airfare' },
                { text: 'Hotel' },
                { text: 'Ground' },
                { text: 'Mileage' },
                { text: 'Entertainment Meals' },
                { text: 'Miscellaneous' },
                { text: 'per Diem' },
            ],
            titleText: 'Add Expense',
            cancelText: 'Cancel',
            cancelFunc: function() {
            },
            buttonClicked: function(index) {
                hideSheet();
                console.log('expense modal index: ' + index);
                if (index == 6) $state.go('app.trip.dates');
                _showExpenseModal(index);
                return true;
            }
        });
        //safety net timeout call to hide the action sheet if no input after 3sec
        $timeout(function() {
            hideSheet();
        }, 3000);
    }
           
    function _showExpenseModal(index, exp) {
        if (!exp) { 
            $scope.isNewExpense = true;
        } else $scope.isNewExpense = false;
        switch(index) {
            case 0:
                $scope.newAirfare = exp;
                _loadAirfareModal();
                break;
            case 1:
                $scope.newHotel = exp;
                _loadHotelModal();
                break;
            case 2:
                $scope.newTransportation = exp;
                _loadTransportationModal();
                break;
            case 3:
                $scope.newMileage = exp;
                _loadMileageModal();
                break;
            case 4:
                $scope.newMeal = exp;
                _loadMealsModal();
                break;
            case 5:
                $scope.newMisc = exp;
                _loadMiscModal();
                break;
            default:
                break;
        }
    }
    
    function _loadAirfareModal() {
        //
        // Load Modal Content and Animation
        //
        $ionicModal.fromTemplateUrl('app/trip/expenses/airfare/airfare.modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
//            $scope.modals[0] = modal;
                $scope.modal = modal
                modal.show();
          });		
    }
    
    function _loadHotelModal() {
        //
        // Load Modal Content and Animation
        //
        $ionicModal.fromTemplateUrl('app/trip/expenses/hotel/hotel.modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
//            $scope.modals[1] = modal;
            $scope.modal = modal
            modal.show();
          });		
    }
    
    function _loadTransportationModal() {
        //
        // Load Modal Content and Animation
        //
        $ionicModal.fromTemplateUrl('app/trip/expenses/transportation/transportation.modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
//            $scope.modals[2] = modal;
                $scope.modal = modal
                modal.show();
          });		
    }
    
    function _loadMealsModal() {
        //
        // Load Modal Content and Animation
        //
        $ionicModal.fromTemplateUrl('app/trip/expenses/meal/meal.modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
//            $scope.modals[3] = modal;
                $scope.modal = modal
                modal.show();
          });		
    }
    
    function _loadMiscModal() {
        //
        // Load Modal Content and Animation
        //
        $ionicModal.fromTemplateUrl('app/trip/expenses/miscellaneous/miscellaneous.modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
//            $scope.modals[4] = modal;
            $scope.modal = modal
            modal.show();
          });		
    }
    
    function _loadMileageModal() {
        //
        // Load Modal Content and Animation
        //
        $ionicModal.fromTemplateUrl('app/trip/expenses/mileage/mileage.modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
//            $scope.modals[4] = modal;
            $scope.modal = modal
            modal.show();
          });		
    }
});
})();