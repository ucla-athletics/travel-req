(function() {
'use strict';

// dates.routes.js
angular
    .module('trip.dates')
    .run(appRun);

/* @ngInject */
function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
}

function getStates() {
    return [
        {
            state: 'app.trip.dates',
            config: {
                url: '/dates',
                views: {
                    'tab-dates': {
                        templateUrl: 'app/trip/dates/dates.view.html',
                        controller: 'DatesCtrl'
                    }        
                }
            }
        }
    ];
}
})();