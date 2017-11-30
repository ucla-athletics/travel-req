(function() {
'use strict';

// trips.routes.js
angular
    .module('app.trips')
    .run(appRun);

/* @ngInject */
function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
}

function getStates() {
    return [
        {
            state: 'app.trips',
            config: {
                url: '/trips',
                views: {
                    'menuContent': {
                        templateUrl: 'app/trips/trips.view.html',
                        controller: 'TripsCtrl'
                    }        
                }
            }
        },
        {
            state: 'app.single',
            config: {
                url: '/trips/:tripId',
                abstract: true,
                views: {
                    'menuContent': {
                        templateUrl: 'app/trips/trip.view.html',
                        controller: 'TripCtrl'
                    }        
                }
            }
        }
    ];
}
})();
