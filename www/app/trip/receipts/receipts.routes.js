(function() {
'use strict';

// receipts.routes.js
angular
    .module('trip.receipts')
    .run(appRun);

/* @ngInject */
function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
}

function getStates() {
    return [
        {
            state: 'app.trip.receipts',
            config: {
                url: '/receipts',
                views: {
                    'tab-receipts': {
                        templateUrl: 'app/trip/receipts/receipts.view.html',
                        controller: 'ReceiptsCtrl'
                    }        
                }
            }
        },
        {
            state: 'app.image',
            config: {
                url: '/image',
                views: {
                    'menuContent': {
                        templateUrl: 'app/trip/receipts/receipt.view.html',
                        controller: 'ReceiptCtrl'
                    }        
                }
            }
        }
    ];
}
})();