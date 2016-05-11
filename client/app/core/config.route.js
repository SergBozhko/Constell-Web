(function () {
    'use strict';

    angular.module('app')
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
            var routes, setRoutes;

            routes = [
                'ui/cards', 'ui/typography', 'ui/buttons', 'ui/icons', 'ui/grids', 'ui/widgets', 'ui/components', 'ui/timeline', 'ui/lists', 'ui/pricing-tables',
                'map/maps',
                'table/static', 'table/dynamic', 'table/responsive',
                'form/elements', 'form/layouts', 'form/validation', 'form/wizard',
                'chart/echarts', 'chart/echarts-line', 'chart/echarts-bar', 'chart/echarts-pie', 'chart/echarts-scatter', 'chart/echarts-more',
                'page/404', 'page/500', 'page/blank', 'page/forgot-password', 'page/invoice', 'page/lock-screen', 'page/profile', 'page/signin', 'page/signup',
                'app/calendar'
            ];

            setRoutes = function(route) {
                var config, url;
                url = '/' + route;
                config = {
                    url: url,
                    templateUrl: 'app/' + route + '.html'
                };
                $stateProvider.state(route, config);
                return $stateProvider;
            };

            routes.forEach(function(route) {
            return setRoutes(route);
            });

            $urlRouterProvider
                .when('/', '/dashboard')
                .otherwise('/dashboard');


            $stateProvider.state('dashboard', {
                url: '/dashboard',
                templateUrl: 'app/dashboard/dashboard.html'
            });


            // Users
            $stateProvider.state('users', {
                url: '/users',
                templateUrl: 'app/users/users.html',
                controller: 'UsersCtrl',
                controllerAs: 'users'
            });


            // Tenders
            $stateProvider.state('tenders', {
                url: '/tenders',
                templateUrl: 'app/tenders/tenders.html',
                controller: 'TendersCtrl',
                controllerAs: 'tenders'
            });
            $stateProvider.state('tender', {
                url: '/tenders/:tender',
                templateUrl: 'app/tenders/tender.stats.html',
                controller: 'TenderStatsCtrl',
                controllerAs: 'tender'
            });
            $stateProvider.state('tenderAdd', {
                url: '/tenders/add/',
                templateUrl: 'app/tenders/tender.add.html',
                controller: 'TendersAdd',
                controllerAs: 'tender'
            });

        }]
    );

})();
