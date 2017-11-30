(function() {
    'use strict';

    angular
        .module('blocks.logger')
        .factory('logger', logger);

    logger.$inject = ['$log', '$fileLogger'];

    function logger($log, $fileLogger) {
        var service = {
            showToasts: true,
            toastTimeout: 750, 

            error   : error,
            info    : info,
            success : success,
            warning : warning,

            // straight to console; bypass toastr
            log     : $log.log
        };

        return service;
        /////////////////////

        function error(message, data, title) {
//            $cordovaToast.show(message, title);
            $fileLogger.error(message);
//            $log.error('Error: ' + message, data);
        }

        function info(message, data, title) {
//            $cordovaToast.show(message, title);
            $log.info('Info: ' + message, data);
        }

        function success(message, data, title) {
//            $cordovaToast.show(message, title);
            $log.info('Success: ' + message, data);
        }

        function warning(message, data, title) {
//            $cordovaToast.show(message, title);
            $log.warn('Warning: ' + message, data);
        }
    }
}());