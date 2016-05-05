/**
 * Created by admin on 05.05.16.
 */

(function() {

    'use strict';

    angular.module('app.users')
        .controller('UsersCtrl', ['$scope', 'MainSettings', 'rest', UsersCtrl]);

    function UsersCtrl($scope, MainSettings, rest) {

        var self = this;

        // get users list
        self.list = rest.get({customUrl: 'User'});

        self.list.$promise.then(function(response) {
            console.log(response);
        });


    }

})();
