(function() {
'use strict';

    var svc = 'VersionSvc';
    angular.module('app.version')

    .service(svc, function(logger, $cordovaAppVersion) {
        var self = this;
        self.version = "1.1.x";

        _init();
        function _init() {
            document.addEventListener("deviceready", function () {
                $cordovaAppVersion.getVersionNumber().then(function (version) {
                    self.version = version;
                    logger.info(svc + '::init - completed');
                }).catch(function(err) {
                    logger.info(svc + '::error - ' + err);
                });
            }, false);        
        }
    });
})();