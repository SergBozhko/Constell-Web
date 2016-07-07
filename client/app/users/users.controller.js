/**
 * Created by admin on 05.05.16.
 */

(function () {

    'use strict';

    angular.module('app.users')
        .controller('UsersCtrl', ['tCtrl', 'UserModel', 'tOrderPos', UsersCtrl]);

    function UsersCtrl(tCtrl, UserModel, tOrderPos) {

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

})();
