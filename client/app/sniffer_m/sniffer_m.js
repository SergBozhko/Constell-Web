/**
 * Created by sniffer on 29.04.16.
 */

;(function() {

    'use strict';

    angular.module('sniffer_m')
        .constant('MainSettings', {
            /* ====================
                RELEASE MODE
             ==================== */
            releaseMode: false,

            // Url's
            serverDirect: function() {
                if (this.releaseMode) {
                    return this.releaseServer;
                } else {
                    return this.localUrl;
                }
            },
            localUrl: 'http://192.168.1.57/byydSystemWebApi/',
            devServUrl: 'http://devsystem.lynx.pro/',
            releaseServer: 'http://system.lynx.pro/',
            account: 'api/Account/',

            // Logging mode trigger
            logMode: true
        })
        .config(['$httpProvider', function($httpProvider) {
            $httpProvider.defaults.withCredentials = true;
        }]);

})();
