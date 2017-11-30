(function() {
    'use strict';

    angular.module('blocks', ['blocks.router', 'blocks.logger', 'blocks.exception', 'blocks.pouchdb', 'blocks.email']);
})();