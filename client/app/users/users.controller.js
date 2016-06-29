/**
 * Created by admin on 05.05.16.
 */

(function () {

    'use strict';

    angular.module('app.users')
        .controller('UsersCtrl', ['tCtrl', 'UserModel', UsersCtrl]);

    function UsersCtrl(tCtrl, UserModel) {

        var testUser = new UserModel(5, 'Sergey');
        console.log(testUser);

        var self = this;

        self.userCnfg = {
            customUrl: 'User/GetUsers',
            Page: 1,
            PerPage: 15,
            SearchName: 'company'
        };
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

})();
