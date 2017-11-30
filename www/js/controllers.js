angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, VersionSvc, Trip, TripSvc, SettingsSvc) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
    $scope.versionSvc = VersionSvc;
    $scope.newTrip = _newTrip;

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };
    
    $scope.addTrip = function() {
        TripSvc.addTrip($scope.newTrip);
        TripSvc.pause();
        $scope.newTrip = {};
        $scope.modal.hide();
    };

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

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
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
})

.controller('BrowseCtrl', function($scope, $log) {
	$scope.$on('$ionicView.enter', function() {
		$log.info('BrowseCtrl_enter');
	});
	$scope.$on('$ionicView.leave', function() {
		$log.info('BrowseCtrl_leave');
	});
})

.controller('SearchCtrl', function($scope, $log) {
	$scope.$on('$ionicView.enter', function() {
		$log.info('SearchCtrl_enter');
	});
	$scope.$on('$ionicView.leave', function() {
		$log.info('SearchCtrl_leave');
	});
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('TabOneCtrl', function($scope, $log) {
	$scope.$on('$ionicView.enter', function() {
		$log.info('TabOneCtrl_enter');
	});
	$scope.$on('$ionicView.leave', function() {
		$log.info('TabOneCtrl_leave');
	});
})

.controller('TabTwoCtrl', function($scope, $log) {
	$scope.$on('$ionicView.enter', function() {
		$log.info('TabTwoCtrl_enter');
	});
	$scope.$on('$ionicView.leave', function() {
		$log.info('TabTwoCtrl_leave');
	});
})

.controller('TabThreeCtrl', function($scope, $log) {
	$scope.$on('$ionicView.enter', function() {
		$log.info('TabThreeCtrl_enter');
	});
	$scope.$on('$ionicView.leave', function() {
		$log.info('TabThreeCtrl_leave');
	});
});
