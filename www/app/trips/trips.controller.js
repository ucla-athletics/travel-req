(function() {
'use strict';

var ctrl = 'TripsCtrl';
angular.module('app.trips')

.controller(ctrl, function($scope, $q, $state, $ionicPopup, $ionicModal
                                    , $ionicLoading, $cordovaEmailComposer, $ionicListDelegate
									, logger
                                    , TripSvc, ReportSvc, EmailSvc, ReportMock
                                    , Trip, TravelDate, Receipt
                                    , SettingsSvc) {
    $scope.tripSvc = TripSvc;
    $scope.gotoTrip = _gotoTrip;
    $scope.deleteTrip = _deleteTrip;
    $scope.sendTrip = _sendTrip;
    $scope.$on('$ionicView.enter', function() { _init(); });
    $scope.$on('$ionicView.leave', function() { _save(); });
    //_init();
    function _init() {
		logger.info('Enter Controller: ' + ctrl);
		$scope.$on('TripSvc::ready', function(event, msg) {
			$scope.$apply();
		});		 
//
// ReportSvc Event Listeners: Progress/Done
//
		$scope.$on('ReportSvc::Progress', function(event, msg) {
			showLoading(msg);
		});		 
		$scope.$on('ReportSvc::Done', function(event, err) {
			hideLoading();
		});
    }
    
    function _save() {
		logger.info('Leave Controller: ' + ctrl);
        console.log('TripCtrl: saving tripSvc data to localStorage');
        TripSvc.pause();
    }

    function _newTrip() {
        //set today as the start date
        var startDate = new Date();
        //and set the endDate default to 5 days from start
        var endDate = new Date();
        endDate.setDate(endDate.getDate() + parseInt(5));
        //create the trip w/ a title, city, start and end
        var trip = new Trip(SettingsSvc.defaultTitle);
        trip.purpose = SettingsSvc.defaultPurpose;
        trip.homeCity = SettingsSvc.homeCity;
        trip.startDate = startDate;
        trip.endDate = endDate;
        trip.vehicleUsed = "Personal";
        //build a default destination list for now
//        trip.destinations = [{id:1,title:'Seattle'}, {id:2,title:'Tacoma'}, 
//                           {id:3,title:'Pullman'}];
        trip.destinations = "";
        
        console.log('start: ' + trip.startDate.toLocaleDateString());
        console.log('end: ' + trip.endDate.toLocaleDateString());
        
        return trip;
    }
	
	function _sendTrip(t) {
//        var t = TripSvc.currentTrip;        
        if (_validateTrip(t)) {
            _confirmProfileEmail().then(function(res) {
                if (res) {
                    return _confirmNoReceipts(t);
                }
                else { return $q.when( false );}
            }).then(function(res) {
//            $q.when(_confirmNoReceipts(t)).then(function(res) {
                var reportPath = "";
            
                if (res) {
                    return ReportSvc.runReportAsync(t)
                    .then(function(filePath) {
                        reportPath = filePath;
                        return $ionicPopup.alert({ 
                            title: 'Trip Total', 
                            template: 'A report was generated for your trip totaling $' 
                                + t.totalExpenses() + '.  An email is being drafted with the report attached for completing your submission to the travel office.' 
                        });
                    }).then(function(res) {
                        console.log('drafting email to send report');
                        return EmailSvc
                            .sendEmail(t, reportPath);
                    }).then(function() {
                        t.isSubmitted = true;
                        t.save();
                        //$state.go('app.trips');
                        $ionicListDelegate.closeOptionButtons();
                    }).catch(function(e) {
                        //make sure to close the swiped buttons
                        $ionicListDelegate.closeOptionButtons();
                        $ionicPopup.alert({
                            title: 'Submission Problem',
                            template: 'There was a problem preparing your trip report email for submission.  Please check your receipts.'
                        });
                        return $q.reject(e);
                    });                            
                }
            });
        } else {
            return $ionicPopup.alert({ 
                title: 'Invalid Trip', 
                template: 'Your trip is missing a purpose, or a start date, or both.  Please correct and resubmit.'
            });
        }
	}

    function _validateTrip(t) {
        var isValid = true;
        isValid = isValid && (t.purpose && t.purpose.length > 0);
        isValid = isValid && (!!t.startDate);
        return isValid;
    }
    
    function _confirmNoReceipts(trip) {
        if (trip.receipts && trip.receipts.length < 1) {
            var confirmOptions = {
              title: 'No Receipts', // String. The title of the popup.
              template: 'Your trip does not appear to have any receipts.  Are you sure you want to submit this trip without receipts?'
            };
            
            return $ionicPopup.confirm( confirmOptions );

        } else {
            return true;
        }        
    }
    
    function _confirmProfileEmail() {
        if (!SettingsSvc.email || SettingsSvc.email.length < 7) {
            var confirmOptions = {
              title: 'No Email', // String. The title of the popup.
              template: 'You do not appear to have a valid email address listed in your settings.  Please input a valid email in settings before proceeding.'
            };
            
            return $ionicPopup.alert( confirmOptions ).then(function() { return false; });

        } else {
            return $q.when(true);
        }        
    }
    
    $scope.addTrip = function() {
        TripSvc.addTrip($scope.newTrip);
        TripSvc.pause();
        $scope.newTrip = {};
        $scope.modal.hide();
    };
    
    function _gotoTrip(t) {
        console.log('Set Current Trip --> ' + t.title);
        TripSvc.currentTrip = t;
//        $state.go('app.single.expenses', {'playlistId':t.id});
        $state.go('app.trip.home');
    }
    
    function _deleteTrip(t) {
        var confirmPopup = $ionicPopup.confirm({
         title: 'Delete Trip',
         template: 'Are you sure you want to delete the trip:<br/><br/><b>' + t.title + '</b>'
        });
        confirmPopup.then(function(res) {
         if(res) {
           console.log('Delete Trip');
            TripSvc.deleteTrip(t);
         } else {
           console.log('Cancel Delete');
         }
        });
    }
    
//    $scope.addDestination = function() {
//        var d = { id: $scope.newTrip.destinations.length + 1, title: 'another' };
//        $scope.newTrip.destinations.push(d);
//    };
//
// MODAL - Add Trip Form
//    
    $ionicModal.fromTemplateUrl('app/trips/add-trip.modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function() {
        $scope.newTrip = _newTrip();
        $scope.modal.show();
    };
    $scope.closeModal = function() {
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
//
// Loading UI Functions: utility functions to show/hide loading UI
//
    function showLoading(msg) {
        $ionicLoading.show({
          template: msg
        });
    }
    function hideLoading(){
        $ionicLoading.hide();
    }
});
})();