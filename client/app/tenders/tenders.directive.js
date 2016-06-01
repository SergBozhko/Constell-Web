/**
 * Created by serg on 28.05.16.
 */
(function() {

    'use strict';

    angular.module('app.tenders')
        .directive('offerGroup', offerGroup);

    function offerGroup() {
        return {
            restrict: 'A',
            link: offerGroupLink
        };

        function offerGroupLink(scope) {
            scope.opened = false;

            scope.open = function() {
                (scope.opened) ? scope.opened = false : scope.opened = true;
            }
        }
    }

})();
