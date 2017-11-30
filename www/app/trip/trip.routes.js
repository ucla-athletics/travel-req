(function() {
'use strict';

// tabbedItem.routes.js
angular
    .module('starter.routes')
    .run(appRun);

/* @ngInject */
function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
}

function getStates() {
    return [
        {
            state: 'app.trip',
            config: {
                url: '/trip',
                abstract: true, 
                views: {
                    'menuContent': {
                        templateUrl: 'app/trip/trip.view.html',
                        controller: 'TripCtrl'
                    }        
                }
            }
        }
    ];
}
})();