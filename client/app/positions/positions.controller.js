/**
 * Created by serg on 25.05.16.
 */
(function () {

    'use strict';

    angular.module('app.positions')
        .controller('PositionsCtrl', ['tCtrl', 'rest', '$mdDialog', PositionsCtrl])
        .controller('PositionsStatsCtrl', ['tCtrl', 'rest', '$stateParams', PositionsStatsCtrl])
        .controller('PositionsAdd', ['rest', 'positionAddObj', 'MessageInfo', '$state', PositionsAdd])
        .controller('PositionsEdit', ['rest', 'positionAddObj', '$stateParams', 'MessageInfo', PositionsEdit]);

    // Main positions controller
    function PositionsCtrl(tCtrl, rest, $mdDialog) {

        var self = this;

        self.getPositions = getPositions;
        self.orderList = orderList;
        self.search = search;
        self.searchWasChanged = searchWasChanged;
        self.clearSearch = clearSearch;
        self.deletePosition = deletePosition;

        self.categories = rest.get({customUrl: 'Tender/GetCategories'});

        /**
         * @type {{customUrl: string, Page: number, PerPage: number}}
         * Main tenders config obj
         */
        self.positionCnfg = {
            customUrl: 'Position/GetPositions',
            categoryId: null,
            Page: 1,
            PerPage: 10,
            SearchName: 'title'
        };
        self.preloader = true;

        /**
         * Get positions list
         */
        function getPositions() {
            self.preloader = true;

            self.list = tCtrl.getElements(self.positionCnfg);
            self.list.$promise.then(function() {
                self.preloader = false;
            });

        }

        function orderList(orderField) {

            tCtrl.order(self.positionCnfg, orderField);
            getPositions();

        }


        // Search
        var changed = false;

        function search() {

            if (changed) {
                getPositions();

                changed = false;
            }

        }

        // Search was changed
        function searchWasChanged() {
            changed = true;
        }

        function clearSearch() {

            if (self.positionCnfg.Search != '' && self.positionCnfg.Search != null) {
                self.positionCnfg.Search = '';
                searchWasChanged();
                search();
            }

        }


        // Delete positions
        function deletePosition(positionId, positionName) {

            rest.save({customUrl: 'Position/DelPosition', positionId: positionId});

            console.log(positionName + ' был удален');

            getPositions();
        }

        self.showConfirm = function (ev, positionId, positionName) {
            var confirm = $mdDialog.confirm()
                .title('Вы действительно хотите удалить "' + positionName + '"?')
                .content('')
                .ariaLabel('Удаление')
                .targetEvent(ev)
                .ok('Да')
                .cancel('Отменить');
            $mdDialog.show(confirm).then(function () {
                deletePosition(positionId, positionName);
            });
        };

        getPositions();
    }

    // Position stats
    function PositionsStatsCtrl(tCtrl, rest, $stateParams) {

        var self = this;

        // Info about position
        self.info = rest.get({customUrl: 'Position/GetPosition', positionId: $stateParams.positionId});

        self.info.$promise.then(function (response) {
            console.log('Position/GetPosition (Info about position)', response);
        });

    }

    // Position add
    function PositionsAdd(rest, positionAddObj, MessageInfo, $state) {

        var self = this;

        // Position functions
        self.savePosition = savePosition;

        self.positionAddObj = positionAddObj;

        for (var field in self.positionAddObj) {
            if (self.positionAddObj.hasOwnProperty(field)) {
                self.positionAddObj[field] = '';
            }
        }

        // Gei position init data
        self.posUnits = rest.query({customUrl: 'Position/GetUnits'});
        self.posCurrencys = rest.query({customUrl: 'Position/GetCurrencys'});
        self.posFactories = rest.query({customUrl: 'Position/GetFactories'});
        self.posCategory = rest.get({customUrl: 'Tender/GetCategories'});


        function savePosition() {
            var autoText = 'По договоренности, на основании согласованных заявок';

            if (self.positionAddObj.MaterialTerms == '' || self.positionAddObj.MaterialTerms == null) {
                self.positionAddObj.MaterialTerms = autoText;
            }

            if (self.positionAddObj.MaterialConditions == '' || self.positionAddObj.MaterialConditions == null) {
                self.positionAddObj.MaterialConditions = autoText;
            }

            rest.save({customUrl: 'Position/SavePositions'}, self.positionAddObj, function(response) {
                MessageInfo.show('Позиция успешно добавлена!');

                $state.go('positions');
            });

            console.log('Сохраняю позицию: ', self.positionAddObj);
        }
    }

    // Position edit
    function PositionsEdit(rest, positionAddObj, $stateParams, MessageInfo) {

        var self = this;

        // Position functions
        self.savePosition = savePosition;

        self.positionAddObj = positionAddObj;


        // Gei position init data
        self.posUnits = rest.query({customUrl: 'Position/GetUnits'});
        self.posCurrencys = rest.query({customUrl: 'Position/GetCurrencys'});
        self.posFactories = rest.query({customUrl: 'Position/GetFactories'});
        self.posCategory = rest.get({customUrl: 'Tender/GetCategories'});

        // Init position model && bind with view models
        self.position = rest.get({customUrl: 'Position/GetPosition', positionId: $stateParams.positionId});
        self.position.$promise.then(function (response) {

            self.positionAddObj.CategoryId = response.category.id;
            self.positionAddObj.Title = response.title;
            self.positionAddObj.MaterialPlace = response.materialPlace.id;
            self.positionAddObj.MaterialTerms = response.materialTerms;
            self.positionAddObj.MaterialParametrs = response.materialParametrs;
            self.positionAddObj.MaterialConditions = response.materialConditions;
            self.positionAddObj.Currency = response.currency.id;
            self.positionAddObj.Unit = response.unit.id;
            self.positionAddObj.Id = response.id;

            console.log('Position/GetPosition ', response);

        });

        // Save position
        function savePosition() {
            var autoText = 'По договоренности, на основании согласованных заявок';

            if (self.positionAddObj.MaterialTerms == '' || self.positionAddObj.MaterialTerms == null) {
                self.positionAddObj.MaterialTerms = autoText;
            }

            if (self.positionAddObj.MaterialConditions == '' || self.positionAddObj.MaterialConditions == null) {
                self.positionAddObj.MaterialConditions = autoText;
            }

            rest.save({customUrl: 'Position/SavePositions'}, self.positionAddObj, function(response) {
                MessageInfo.show('Позиция успешно сохранена!');
            });

            console.log('Сохраняю позицию: ', self.positionAddObj);
        }

    }

})();
