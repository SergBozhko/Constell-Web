/**
 * Created by sniffer on 29.04.16.
 */

(function() {

    'use strict';

    angular.module('app')
        .service('Errors', ['$rootScope', '$state', '$timeout', Errors])
        .service('tableControlls', tableControlls);

    // Errors
    function Errors($rootScope, $state, $timeout) {

        function showErrorWindow() {
            $rootScope.errorMessageShow = true;

            $timeout(function() {
                $rootScope.errorMessageShow = false;
            }, 5000);
        }

        // Main errors
        this.main = function(response) {

            switch (response.status) {

                case 400: {
                    console.log('Bad request!');
                    $rootScope.errorMessage = response.message;

                    showErrorWindow();
                } break;

                case 401: {
                    console.log('User not authorized!');
                    $state.go('signin');
                } break;

                case 405: {
                    console.log('Method is not allowed!');
                    $rootScope.errorMessage = response.message;

                    showErrorWindow();
                } break;

                case 500: {
                    console.log('Server error!');
                    $rootScope.errorMessage = response.message;

                    showErrorWindow();
                } break;

            }

        };

    }


    // Table controlls functions
    function tableControlls() {

    }

})();
