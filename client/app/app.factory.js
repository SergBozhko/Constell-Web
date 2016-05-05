/**
 * Created by sniffer on 29.04.16.
 */

(function() {

    'use strict';

    angular.module('app')

        // Main REST factory
        .factory('rest',  ['$resource', 'MainSettings', function ($resource, MainSettings) {
            return $resource(MainSettings.serverDirect() + 'api/:customUrl', {
                addUrl: '@customUrl'
            }, {
                'query':  {method:'GET', isArray: true},
                'get':  {method:'GET', isArray: false}
            })
        }])

        // Initialize user data on auth and app controllers
        .factory('userDataInit', ['$rootScope', function($rootScope) {
            var userInitFactory;
            userInitFactory = function () {
                $rootScope.UserFirstPreloader = true;
                $rootScope.subUser = $rootScope.userData.subUser;
                $rootScope.userRole = $rootScope.userData.role;
            };
            return userInitFactory;
        }]);

})();
