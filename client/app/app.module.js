(function () {
    'use strict';

    angular.module('app', [
        // Core modules
         'app.core'

        // Custom Feature modules
        ,'app.chart'
        ,'app.ui'
        ,'app.ui.form'
        ,'app.ui.form.validation'
        ,'app.page'
        ,'app.table'

        // Constell modules
        ,'app.users'
        ,'app.tenders'
        ,'app.positions'

        // 3rd party feature modules
        ,'ui.tree'
        ,'ngMap'
        ,'textAngular'
        ,'ngResource'
        ,'ngLodash'

    ])
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
        localUrl: 'http://192.168.0.101/lynxDashboard/',
        devServUrl: 'http://devsystem.lynx.pro/',
        releaseServer: 'http://tenders.lynx.pro/system/',
        account: 'api/Account/',

        // Logging mode trigger
        logMode: true
    })
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }]);

})();

