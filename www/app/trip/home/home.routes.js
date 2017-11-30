(function() {
'use strict';

// home.routes.js
angular
    .module('trip.home')
    .run(appRun);

/* @ngInject */
function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
}

function getStates() {
    return [
        {
            state: 'app.trip.home',
            config: {
                url: '/home',
                views: {
                    'tab-home': {
                        templateUrl: 'app/trip/home/home.view.html',
                        controller: 'HomeCtrl'
                    }        
                }
            }
        }
    ];
}
})();