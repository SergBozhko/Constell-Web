/**
 * Created by sniffer on 29.04.16.
 */

(function() {

    'use strict';

    angular.module('app')
        .factory('tCtrl', ['MainSettings', 'rest', 'lodash', tCtrl])
        .factory('tOrderPos', tOrderPos)

        // Main REST factory
        .factory('rest',  ['$resource', 'MainSettings', function ($resource, MainSettings) {
            return $resource(MainSettings.serverDirect() + 'api/:customUrl', {
                customUrl: '@customUrl',
                tenderId: '@tenderId',
                positionId: '@positionId',
                categoryId: '@categoryId',
                userId: '@userId'
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


    // Table controlls functions
    function tCtrl(MainSettings, rest, lodash) {

        var Ctrls = {
            getElements: getElements,
            order: order
        };

        /**
         * @param config Object with config data
         * Get elements
         */
        function getElements (config) {
            // List to save response data
            var listContainer;

            console.log('Высылаю конфиг', config);

            listContainer = rest.save(MainSettings.serverDirect() + '/api/' + config.customUrl, config);


            listContainer.$promise.then(function (response) {
                config.totalCount = response.TotalItemsCount;
                console.log(config.customUrl, ': ', response);
            });

            return listContainer;

        }

        /**
         * @param config Object with config data
         * @param orderField
         * Main order function
         */
        function  order(config, orderField) {
            // Reset page
            config.Page = 1;

            var order = {
                    target: orderField,
                    course: 'desc'
                },
                fieldIndex = lodash.findIndex(config.OrderBy, function (index) {
                    return index.target == orderField;
                });

            if (fieldIndex == -1) {
                config.OrderBy = [];
                config.OrderBy.push(order);
                config.OrderByInfo = order;
            } else {

                if (config.OrderBy[fieldIndex].target == orderField) {

                    if (config.OrderBy[fieldIndex].course == 'asc') {

                        config.OrderBy[fieldIndex].course = 'desc';
                        config.OrderByInfo.course = 'desc';

                    } else {

                        config.OrderBy[fieldIndex].course = 'asc';
                        config.OrderByInfo.course = 'asc';

                    }
                }


            }
        }

        return Ctrls;

    }

    // Table order position
    function tOrderPos() {

        var check = function(obj) {

            if (obj.OrderByInfo.course == 'asc') {
                return 'zmdi-caret-up';
            } else {
                return 'zmdi-caret-down';
            }

        };

        return check;

    }

})();
