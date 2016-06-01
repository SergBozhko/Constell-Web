/**
 * Created by sniffer on 29.04.16.
 */

(function () {

    'use strict';

    angular.module('app')
        .service('Errors', ['$rootScope', '$state', '$timeout', Errors])
        .service('MessageInfo', ['$mdToast', MessageInfo]);

    // Errors
    function Errors($rootScope, $state, $timeout) {

        function showErrorWindow() {
            $rootScope.errorMessageShow = true;

            $timeout(function () {
                $rootScope.errorMessageShow = false;
            }, 5000);
        }

        // Main errors
        this.main = function (response) {

            switch (response.status) {

                case 400:
                {
                    console.log('Bad request!');
                    $rootScope.errorMessage = response.message;

                    showErrorWindow();
                }
                    break;

                case 401:
                {
                    console.log('User not authorized!');
                    $state.go('signin');
                }
                    break;

                case 405:
                {
                    console.log('Method is not allowed!');
                    $rootScope.errorMessage = response.message;

                    showErrorWindow();
                }
                    break;

                case 500:
                {
                    console.log('Server error!');
                    $rootScope.errorMessage = response.message;

                    showErrorWindow();
                }
                    break;

            }

        };

    }


    // Message info
    function MessageInfo($mdToast) {

        // Main show action
        this.show = function(text) {
            var last = {
                bottom: false,
                top: true,
                left: false,
                right: true
            };

            self.toastPosition = angular.extend({},last);
            function sanitizePosition() {
                var current = self.toastPosition;

                if ( current.bottom && last.top ) current.top = false;
                if ( current.top && last.bottom ) current.bottom = false;
                if ( current.right && last.left ) current.left = false;
                if ( current.left && last.right ) current.right = false;

                last = angular.extend({},current);
            }
            self.getToastPosition = function() {
                sanitizePosition();

                return Object.keys(self.toastPosition)
                    .filter(function(pos) { return self.toastPosition[pos]; })
                    .join(' ');
            };

            $mdToast.show(
                $mdToast.simple()
                    .content(text)
                    .position(self.getToastPosition())
                    .hideDelay(3000)
            );
        };

    }

})();
