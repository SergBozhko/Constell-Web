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


        self.positionCnfg = {
            customUrl: 'Position/GetPositions',
            categoryId: null,
            Page: 1,
            PerPage: 10,
            SearchName: 'title'
        };
        self.preloader = true;

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

        // Init functions
        self.getOffers = getOffers;
        self.getPositionPraph = getPositionPraph;
        self.orderList = orderList;
        self.search = search;
        self.searchWasChanged = searchWasChanged;
        self.clearSearch = clearSearch;
        self.open = open;
        self.setDate = setDate;

        // Info about position
        self.positionInfoLoader = true;
        self.info = rest.get({customUrl: 'Position/GetPosition', positionId: $stateParams.positionId});

        self.info.$promise.then(function (response) {
            console.log('Position/GetPosition (Info about position)', response);
            self.positionInfoLoader = false;
        });
        // ===============================


        self.categories = rest.get({customUrl: 'Tender/GetCategories'});


        self.positionCnfg = {
            customUrl: 'Position/GetOffersForPosition',
            positionId: $stateParams.positionId,
            categoryId: null,
            Page: 1,
            PerPage: 10,
            SearchName: 'userName'
        };
        self.preloader = true;

        function getOffers() {
            self.preloader = true;

            self.offers = tCtrl.getElements(self.positionCnfg);
            self.offers.$promise.then(function() {
                self.preloader = false;
            });

            // Get graphic
            getPositionPraph(self.positionCnfg);

        }

        function orderList(orderField) {

            tCtrl.order(self.positionCnfg, orderField);
            getOffers();

        }


        // Search
        var changed = false;

        function search() {

            if (changed) {
                getOffers();

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

        // Position graphic
        function getPositionPraph(config) {

            var posCnfg = Object.assign({}, config);

            posCnfg.customUrl = 'Position/GetDataOfGraphForPosition';

            self.stats = tCtrl.getElements(posCnfg);
            self.stats.$promise.then(function(response) {

                self.combo = {};
                self.combo.options = {
                    tooltip: {
                        trigger: 'axis',
                        showDelay: 0,
                        axisPointer: {
                            show: true,
                            type: 'cross',
                            lineStyle: {
                                type: 'dashed',
                                width: 1
                            }
                        },
                        formatter: function (params) {

                            var date = new Date(params.value[0]);

                            return 'Имя: ' + params.value[3] + '<br>'
                                + 'Позиция: ' + params.value[4] + '<br>'
                                + 'Цена: ' + params.value[2] + ' руб<br>'
                                + 'Дата: ' + date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
                        }
                    },
                    legend: {
                        data: ['Постоянные', 'Новые']
                    },
                    toolbox: {
                        show: false
                    },
                    xAxis: [
                        {
                            type: 'value',
                            scale: true,
                            axisLabel: {
                                formatter: function (value, index) {
                                    var date = new Date(value);

                                    return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
                                }
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            scale: true,
                            axisLabel: {
                                formatter: '{value} руб'
                            }
                        }
                    ],
                    series: [
                        {
                            name: 'Постоянные',
                            type: 'scatter',
                            data: response.certified,
                            symbolSize: 8,
                            markPoint: {
                                data: [
                                    //{type : 'max', name: 'Max'},
                                    {type: 'min', name: 'Min'}
                                ]
                            },
                            markLine: {
                                data: [
                                    //{type : 'average', name: 'Average'}
                                ]
                            }
                        },
                        {
                            name: 'Новые',
                            type: 'scatter',
                            data: response.simple,
                            symbolSize: 8,
                            markPoint: {
                                data: [
                                    //{type: 'max', name: 'Max'},
                                    {type: 'min', name: 'Min'}
                                ]
                            },
                            markLine: {
                                data: [
                                    //{type: 'average', name: 'Average'}
                                ]
                            }
                        }
                    ]
                };

                self.stats.$promise.then(function (response) {
                    response.certified.forEach(function (element) {
                        element[0] = new Date(element[0]);
                    });
                    response.simple.forEach(function (element) {
                        element[0] = new Date(element[0]);
                    });
                });

            });
        }

        getOffers();


        // Date picker
        self.status = {
            startDate: false,
            endDate: false
        };
        function open(datePicker) {
            self.status[datePicker] = true;
        }

        function setDate(year, month, day) {
            self.dt = new Date(year, month, day);
        }


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

            self.saveStatus = true;

            var autoText = 'По договоренности, на основании согласованных заявок';

            if (self.positionAddObj.MaterialTerms == '' || self.positionAddObj.MaterialTerms == null) {
                self.positionAddObj.MaterialTerms = autoText;
            }

            if (self.positionAddObj.MaterialConditions == '' || self.positionAddObj.MaterialConditions == null) {
                self.positionAddObj.MaterialConditions = autoText;
            }

            rest.save({customUrl: 'Position/SavePosition'}, self.positionAddObj, function(response) {
                MessageInfo.show('Позиция успешно добавлена!');

                self.saveStatus = false;

                $state.go('positions');
            }, function() {
                MessageInfo.show('Произошла ошибка! Попробуйте позднее...');
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

            self.saveStatus = true;

            var autoText = 'По договоренности, на основании согласованных заявок';

            if (self.positionAddObj.MaterialTerms == '' || self.positionAddObj.MaterialTerms == null) {
                self.positionAddObj.MaterialTerms = autoText;
            }

            if (self.positionAddObj.MaterialConditions == '' || self.positionAddObj.MaterialConditions == null) {
                self.positionAddObj.MaterialConditions = autoText;
            }

            rest.save({customUrl: 'Position/SavePosition'}, self.positionAddObj, function(response) {
                MessageInfo.show('Позиция успешно сохранена!');
                self.saveStatus = false;
            }, function() {
                MessageInfo.show('Произошла ошибка! Попробуйте позднее...');
            });

            console.log('Сохраняю позицию: ', self.positionAddObj);
        }

    }

})();
