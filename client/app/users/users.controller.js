/**
 * Created by admin on 05.05.16.
 */

(function() {

    'use strict';

    angular.module('app.users')
        .controller('UsersCtrl', ['MainSettings', 'rest', UsersCtrl]);

    function UsersCtrl(MainSettings, rest) {

        var self = this;

        // get users list
        self.list = rest.get({customUrl: 'User/GetUsers'});

        self.list.$promise.then(function(response) {
            console.log(response);
        });


    }

})();
