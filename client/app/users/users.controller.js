/**
 * Created by admin on 05.05.16.
 */

(function () {

    'use strict';

    angular.module('app.users')
        .controller('UsersCtrl', ['tCtrl', 'UserConf', 'tOrderPos', UsersCtrl])
        .controller('UserEditCtrl', ['rest', 'tCtrl', 'UserModel', '$stateParams', UserEditCtrl]);

    // All users controller
    function UsersCtrl(tCtrl, UserConf, tOrderPos) {

        var self = this;

        self.userCnfg = new UserConf('User/GetUsers', 1, 15, 'company');
        self.preloader = true;

        // Get users
        self.getUsers = getUsers;
        self.orderList = orderList;
        self.search = search;
        self.searchWasChanged = searchWasChanged;
        self.clearSearch = clearSearch;

        function getUsers() {
            self.preloader = true;

            self.list = tCtrl.getElements(self.userCnfg);
            self.list.$promise.then(function () {
                self.preloader = false;
            });
        }

        function orderList(orderField) {

            tCtrl.order(self.userCnfg, orderField);
            getUsers();

        }

        // Check order type
        self.checkOrder = tOrderPos;


        // Search
        var changed = false;

        function search() {

            if (changed) {
                getUsers();

                changed = false;
            }

        }

        // Search was changed
        function searchWasChanged() {
            changed = true;
        }

        function clearSearch() {

            if (self.userCnfg.Search != '') {
                self.userCnfg.Search = '';
                searchWasChanged();
                search();
            }

        }

        // Init get users
        getUsers();

    }

    // User edit controller
    function UserEditCtrl(rest, tCtrl, UserModel, $stateParams) {

        var self = this;

        // Get user info
        var userData = rest.get({customUrl: 'User/GetUser', userId: $stateParams.userId});
        userData.$promise.then(function (response) {

            self.info = new UserModel(
                response.id,
                response.company,
                response.name,
                response.phone,
                response.email,
                response.categoryId
            );


        });

        // Get categories
        var categories = rest.get({customUrl: 'Tender/GetCategories'});
        categories.$promise.then(function(response) {
            self.categories = response.Result;
        });


    }

})();
