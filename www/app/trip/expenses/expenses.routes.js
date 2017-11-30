(function() {
'use strict';

// expenses.routes.js
angular
    .module('trip.expenses')
    .run(appRun);

/* @ngInject */
function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
}

function getStates() {
    return [
        {
            state: 'app.trip.expenses',
            config: {
                url: '/expenses',
                views: {
                    'tab-expenses': {
                        templateUrl: 'app/trip/expenses/expenses.view.html',
                        controller: 'ExpensesCtrl'
                    }        
                }
            }
        }
    ];
}
})();