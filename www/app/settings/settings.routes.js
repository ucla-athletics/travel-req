(function() {
'use strict';

// settings.routes.js
angular
    .module('app.settings')
    .run(appRun);

/* @ngInject */
function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
}

function getStates() {
    return [
        {
            state: 'app.settings',
            config: {
                url: '/settings',
                views: {
                    'menuContent': {
                        templateUrl: 'app/settings/settings.view.html',
                        controller: 'SettingsCtrl'
                    }        
                }
            }
        }
    ];
}
})();
