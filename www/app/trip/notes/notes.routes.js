(function() {
'use strict';

// notes.routes.js
angular
    .module('trip.notes')
    .run(appRun);

/* @ngInject */
function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
}

function getStates() {
    return [
        {
            state: 'app.trip.notes',
            config: {
                url: '/notes',
                views: {
                    'tab-notes': {
                        templateUrl: 'app/trip/notes/notes.view.html',
                        controller: 'NotesCtrl'
                    }        
                }
            }
        }
    ];
}
})();