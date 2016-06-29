/**
 * Created by serg on 29.06.16.
 */
(function() {

    'use strict';

    angular.module('app.users')
        .factory('UserModel', UserModel);

    // Main User Model
    function UserModel() {

        class User {
            constructor(id, name) {
                this.id = id;
                this.name = name;
            }
        }

        return User;

    }

})();
