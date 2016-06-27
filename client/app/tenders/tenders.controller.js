/**
 * Created by admin on 05.05.16.
 */
(function () {

    'use strict';

    angular.module('app.tenders')
        .controller('TendersCtrl', ['tCtrl', 'rest', '$mdDialog', 'MainSettings', TendersCtrl])
        .controller('TenderStatsCtrl', ['tCtrl', 'rest', '$stateParams', TenderStatsCtrl])
        .controller('TendersAdd', ['tCtrl', 'rest', 'formSteps', 'addTenderModel', 'lodash', 'MessageInfo', '$state', TendersAdd])
        .controller('TenderEdit', ['tCtrl', 'rest', '$stateParams', 'addTenderModel', 'MessageInfo', 'lodash', TenderEdit]);

    // Tenders ctrl
    function TendersCtrl(tCtrl, rest, $mdDialog, MainSettings) {

        var self = this;
        /**
         * Tenders init functions
         */
        self.getTenders = getTenders;
        self.deleteTender = deleteTender;
        self.orderList = orderList;
        self.search = search;
        self.searchWasChanged = searchWasChanged;
        self.clearSearch = clearSearch;

        /**
         * @type {{customUrl: string, Page: number, PerPage: number}}
         * Main tenders config obj
         */
        self.tenderCnfg = {
            customUrl: 'Tender/GetTenders',
            Page: 1,
            PerPage: 15,
            SearchName: 'title'
        };
        self.preloader = true;

        function getTenders() {
            self.preloader = true;

            self.list = tCtrl.getElements(self.tenderCnfg);
            self.list.$promise.then(function () {
                self.preloader = false;
            });
        }

        function orderList(orderField) {

            tCtrl.order(self.tenderCnfg, orderField);
            getTenders();

        }

        // Delete tender
        function deleteTender(tenderId, tenderName) {

            rest.save({customUrl: 'Tender/DelTender', tenderId: tenderId});

            console.log(tenderName + ' был удален');

            getTenders();
        }

        self.showConfirm = function (ev, tenderId, tender) {
            var confirm = $mdDialog.confirm()
                .title('Вы действительно хотите удалить "' + tender + '"?')
                .content('')
                .ariaLabel('Удаление')
                .targetEvent(ev)
                .ok('Да')
                .cancel('Отменить');
            $mdDialog.show(confirm).then(function () {
                deleteTender(tenderId, tender);
            });
        };

        // Search
        var changed = false;

        function search() {

            if (changed) {
                getTenders();

                changed = false;
            }

        }

        // Search was changed
        function searchWasChanged() {
            changed = true;
        }

        function clearSearch() {

            if (self.tenderCnfg.Search != '' && self.tenderCnfg.Search != null) {
                self.tenderCnfg.Search = '';
                searchWasChanged();
                search();
            }

        }

        getTenders();

        // Traffic chart
        self.graph = rest.get({customUrl: 'Tender/GetGraphOfTanders'});
        console.log(self.graph);

        var xAxisData = [];

        // Graph init
        self.graph.$promise.then(function (response) {
            self.combo = {};
            self.combo.options = {
                legend: {
                    show: true,
                    x: 'right',
                    y: 'top',
                    selectedMode: false,
                    padding: [0, 25, 0, 0],
                    data: ['Предложения']
                },
                grid: {
                    x: 40,
                    y: 60,
                    x2: 26,
                    y2: 30,
                    borderWidth: 0
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    axisPointer: {
                        lineStyle: {
                            color: '#EDF0F1'
                        }
                    }
                },
                xAxis: [
                    {
                        type: 'category',
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#607685'
                            }
                        },
                        splitLine: {
                            show: false,
                            lineStyle: {
                                color: '#f3f3f3'
                            }
                        },
                        data: []
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#607685'
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#f3f3f3'
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: 'Предложения',
                        type: 'line',
                        clickable: false,
                        itemStyle: {
                            normal: {
                                color: '#428bca'
                            },
                            emphasis: {
                                color: 'rgb(183, 85, 85)'
                            }
                        },
                        barCategoryGap: '50%',
                        data: [],
                        legendHoverLink: false,
                        z: 2
                    }
                ]
            };

            response.result.forEach(function (element) {
                self.combo.options.xAxis[0].data.push(element.dayStr);
                self.combo.options.series[0].data.push(element.countOffers);
            });
        });

    }

    // Tender ctrl
    function TenderStatsCtrl(tCtrl, rest, $stateParams) {

        var self = this;

        // Init functions
        self.getTenderOffers = getTenderOffers;
        self.orderList = orderList;
        self.search = search;
        self.searchWasChanged = searchWasChanged;
        self.clearSearch = clearSearch;

        // Get best offers
        self.offersPreloader = true;
        self.offers = rest.get({customUrl: 'Tender/GetBestOffers', tenderId: $stateParams.tender});

        self.offers.$promise.then(function (response) {
            self.offersPreloader = false;
            console.log('Tender/GetBestOffers ', response);
        });

        // Info about tender
        self.info = rest.get({customUrl: 'Tender/GetTender/', id: $stateParams.tender});

        self.info.$promise.then(function (response) {
            console.log('Tender/GetTender (Info about tender)', response);
        });



        // ======== Info about offers ========
        self.tenderOffCnfg = {
            customUrl: 'Tender/GetOffersForTander',
            tenderId: $stateParams.tender,
            Page: 1,
            PerPage: 10,
            SearchName: 'userName'
        };
        self.preloaderOffers = true;

        function getTenderOffers() {
            self.preloaderOffers = true;

            self.infoOffers = tCtrl.getElements(self.tenderOffCnfg);
            self.infoOffers.$promise.then(function () {
                self.preloaderOffers = false;
            });
        }

        function orderList(orderField) {

            tCtrl.order(self.tenderOffCnfg, orderField);
            getTenderOffers();

        }

        getTenderOffers();

        // ======== END Info about offers ========

        // Search
        var changed = false;

        function search() {

            if (changed) {
                getTenderOffers();

                changed = false;
            }

        }

        // Search was changed
        function searchWasChanged() {
            changed = true;
        }

        function clearSearch() {

            if (self.tenderOffCnfg.Search != '' && self.tenderOffCnfg.Search != null) {
                self.tenderOffCnfg.Search = '';
                searchWasChanged();
                search();
            }

        }


        // Tender stats
        self.stats = rest.get({customUrl: 'Tender/GetDataOfGraphForTender', tenderId: $stateParams.tender});

        self.stats.$promise.then(function (response) {
            console.log('Tender/GetDataOfGraphForTender ', response);

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

    // Tender add
    function TendersAdd(tCtrl, rest, formSteps, addTenderModel, lodash, MessageInfo, $state) {

        var self = this;

        // Preloaders
        self.positionsPreloader = true;

        // Tabs controll
        self.stepsControlls = formSteps;
        self.goToStep = goToStep;
        self.nextPosition = 'second';
        self.prevPosition = 'first';
        var stepsCtrl = self.stepsControlls.steps;

        function resetSteps() {
            for (var i in stepsCtrl) {
                if (stepsCtrl.hasOwnProperty(i)) {
                    stepsCtrl[i].active = false;
                }
            }
        }

        function goToStep(index) {
            resetSteps();

            stepsCtrl[index].active = true;
            stepsCtrl[index].enable = true;

            (stepsCtrl.second.active) ? self.stepsControlls.finish = true : self.stepsControlls.finish = false;
        }


        // ====== Add tender data ======
        self.getPositions = getPositions;
        self.open = open;
        self.setDate = setDate;
        self.setPosition = setPosition;
        self.addTender = addTender;
        // Add tender model obj
        self.addTenderModel = addTenderModel;

        // Reset fields
        for (var field in self.addTenderModel) {
            if (self.addTenderModel.hasOwnProperty(field)) {
                self.addTenderModel[field] = null;
            }
        }
        self.addTenderModel.IsActive = true;

        // Init date
        var dateToday = new Date();
        self.addTenderModel.StartDate = new Date();
        self.addTenderModel.EndDate = dateToday;
        self.addTenderModel.EndDate.setMonth(dateToday.getMonth() + 1);

        self.categoryList = rest.get({customUrl: 'Tender/GetCategories'});

        self.positionCnfg = {
            customUrl: 'Position/GetPositions',
            categoryId: null,
            SearchName: 'title'
        };

        // Get positions
        function getPositions() {
            self.positionsPreloader = true;
            self.addTenderModel.PositionList = [];

            self.positionsList = tCtrl.getElements(self.positionCnfg);
            self.positionsList.$promise.then(function (response) {
                self.positionsPreloader = false;

                response.Result.forEach(function (item) {
                    item.selected = false;
                });

                self.clearList = clearList;
                // Clear list function
                function clearList() {
                    self.addTenderModel.PositionList = [];
                    response.Result.forEach(function (item) {
                        item.selected = false;
                    });
                }
            });
        }


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

        /**
         * @param positionId Id Позиции
         * @param title Название позиции
         * Set position to array
         */
        function setPosition(positionId, title, unit, currency) {
            var setPosObj = {
                    positionId: positionId,
                    title: title,
                    amount: null,
                    minPrice: null,
                    unit: unit,
                    currency: currency,
                    selected: true
                },
                posIndex = lodash.findIndex(self.addTenderModel.PositionList, setPosObj);

            if (posIndex == -1) {
                self.addTenderModel.PositionList.push(setPosObj);
            } else {
                self.addTenderModel.PositionList.splice(posIndex);
            }

        }


        // Save tender
        function addTender() {

            self.savingStatus = true;

            console.log('Отсылаю ', self.addTenderModel);
            rest.save({customUrl: 'Tender/SaveTender'}, self.addTenderModel, function (response) {

                MessageInfo.show('Тендер успешно добавлен!');

                self.savingStatus = false;

                $state.go('tenders');

            }, function() {
                MessageInfo.show('Произошла ошибка! Попробуйте позднее...');
            });
        }

    }

    // Tender Edit
    function TenderEdit(tCtrl, rest, $stateParams, addTenderModel, MessageInfo, lodash) {

        var self = this;

        // Init functions
        self.open = open;
        self.setDate = setDate;

        // Add tender model
        self.addTenderModel = addTenderModel;
        self.addTenderModel.PositionList = [];


        // Get tender init
        self.tenderToEdit = rest.get({customUrl: 'Tender/GetTender/', id: $stateParams.tenderToEdit});
        self.tenderToEdit.$promise.then(function (response) {
            console.log('Tender to edit: ', response);

            // Update add tender model
            self.addTenderModel.Id = response.id;
            self.addTenderModel.Title = response.title;
            self.addTenderModel.StartDate = response.startTimeDate;
            self.addTenderModel.EndDate = response.endTimeDate;
            self.addTenderModel.isActive = response.isActive;
            self.addTenderModel.ForCertificed = response.ForCertificed;
            self.addTenderModel.IsOpenTender = response.isOpenTender;
            self.addTenderModel.CategoryId = response.categoryId;
            response.positionsList.forEach(function(item) {
                self.addTenderModel.PositionList.push({
                    id: item.id,
                    title: item.title,
                    amount: item.amount,
                    minPrice: item.minPrice,
                    currency: item.currency,
                    unit: item.unit
                });
            });

            // Get positions
            self.positionsPreloader = true;
            self.positionCnfg = {
                customUrl: 'Position/GetPositions',
                categoryId: self.addTenderModel.CategoryId,
                SearchName: 'title'
            };
            self.positionsList = tCtrl.getElements(self.positionCnfg);
            self.positionsList.$promise.then(function (response) {
                self.positionsPreloader = false;

                self.addTenderModel.PositionList.forEach(function(item) {

                    var findIndex = lodash.findIndex(response.Result, {'id': item.id});
                    if(findIndex != -1) {
                        response.Result[findIndex].selected = item.id;
                    }
                });
            });

            // Set position
            self.setPosition = function(id, title, unit, currency) {

                var addObj = {
                    id: id,
                    title: title,
                    amount: null,
                    minPrice: null,
                    unit: unit,
                    currency: currency
                },
                findIndex = lodash.findIndex(self.addTenderModel.PositionList, {'id': id});

                if (findIndex != -1) {
                    self.addTenderModel.PositionList.splice(findIndex, 1);
                } else {
                    self.addTenderModel.PositionList.push(addObj);
                }

                console.log(findIndex);

            };

            // Update tender
            self.updatePreloader = false;
            self.updateTender = function() {
                self.updatePreloader = true;
                self.savingStatus = true;

                console.log('Обновляю тендер ', self.addTenderModel);
                rest.save({customUrl: 'Tender/SaveTender'}, self.addTenderModel, function (response) {

                    MessageInfo.show('Изменения успешно сохранены');
                    self.savingStatus = false;

                }, function() {
                    MessageInfo.show('Произошла ошибка! Попробуйте позднее...');
                });
            }

        });

        // Categories
        self.categoryList = rest.get({customUrl: 'Tender/GetCategories'});


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

})();

