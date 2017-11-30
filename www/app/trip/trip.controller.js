(function() {
'use strict';

var ctrl = 'TripCtrl';
angular.module('app.trip')

.controller(ctrl, function($scope, $log, $q, $state, $ionicPopup
                            , SettingsSvc, TripSvc, EmailSvc, ReportSvc) {
	$scope.vm = {
		message: 'This is a tabbed trip controller from the menu.'
	};
    $scope.sendTrip = _sendTrip;
	
	$scope.$on('$ionicView.enter', function() {
//		$log.info(ctrl + '_enter');
	});
	$scope.$on('$ionicView.leave', function() {
//		$log.info(ctrl + '_leave');
	});

    function _sendTrip_NoValidation() {
        ReportSvc
            .runReportAsync(TripSvc.currentTrip)
            .then(function(filePath) {
                console.log('drafting email to send report');
                TripSvc.currentTrip.isSubmitted = true;
                EmailSvc
                    .sendEmail(TripSvc.currentTrip, filePath)
                    .then(function() {
                        $state.go('app.trips');
                    });
            });
    }
    
	function _sendTrip() {
        var t = TripSvc.currentTrip;
        
        return _confirmProfileEmail().then(function(res) {
            if (res) {
                return _confirmNoReceipts(t);
            }
            else { return $q.when( false );}
        }).then(function(res) {
            var reportPath = "";
            
            if (res) {
                return ReportSvc
                .runReportAsync(TripSvc.currentTrip)
                .then(function(filePath) {
                    reportPath = filePath;
                    TripSvc.currentTrip.isSubmitted = true;
                    return $ionicPopup.alert({ 
                        title: 'Trip Total', 
                        template: 'A report was generated for your trip totaling $' 
                            + t.totalExpenses() + '.  An email is being drafted with the report attached for completing your submission to the travel office.' 
                    });
                }).then(function(res) {
                    console.log('drafting email to send report');
                    return EmailSvc
                        .sendEmail(TripSvc.currentTrip, reportPath);                        
                }).then(function() {
                    t.isSubmitted = true;
                    t.save();
                    $state.go('app.trips');
                }).catch(function(e) {
                    console.info('ok, the error made it back to the _sendTrip starting pt.');
                    $ionicPopup.alert({
                        title: 'Submission Problem',
                        template: 'There was a problem preparing your trip report email for submission.  Please check your receipts.'
                    });
                    return $q.reject(e);
                });                            
            } else {
                console.log('no receipts, trip submit cancelled...');
            }
        });        
	}
    
    function _confirmNoReceipts(trip) {
        if (trip.receipts && trip.receipts.length < 1) {
            var confirmOptions = {
              title: 'No Receipts', // String. The title of the popup.
              template: 'Your trip does not appear to have any receipts.  Are you sure you want to submit this trip without receipts?'
            };
            
            return $ionicPopup.confirm( confirmOptions );

        } else {
            return $q.when(true);
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
});
})();