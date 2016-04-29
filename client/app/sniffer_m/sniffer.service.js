/**
 * Created by sniffer on 29.04.16.
 */

;(function() {

    'use strict';

    angular.module('sniffer_m')
        .service('Errors', ['$scope', '$state', Errors]);

    // Errors
    function Errors($scope, $state) {

        // Main errors
        this.main = function(response) {

            switch (response.status) {

                case 400: {
                    console.log('Bad request!');
                    $scope.errorMessage = response.errorMessage;
                } break;

                case 401: {
                    console.log('User not authorized!');
                    $state.go('signin');
                } break;

                case 405: {
                    console.log('Method is not allowed!');
                    $scope.errorMessage = response.errorMessage;
                } break;

                case 500: {
                    console.log('Server error!');
                    $scope.errorMessage = response.errorMessage;
                } break;

            }

        };

    }

})();
