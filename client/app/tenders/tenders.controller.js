/**
 * Created by admin on 05.05.16.
 */
(function () {

    'use strict';

    angular.module('app.tenders')
        .controller('TendersCtrl', ['MainSettings', '$http', 'rest', 'Errors', TendersCtrl])
        .controller('TenderStatsCtrl', ['rest', '$stateParams', TenderStatsCtrl])
        .controller('TendersAdd', ['rest', 'formSteps', 'addTenderModel', 'lodash', TendersAdd])
        .controller('TenderEdit', ['rest', '$stateParams', 'addTenderModel', 'lodash', TenderEdit]);

    // Tenders ctrl
    function TendersCtrl(MainSettings, $http, rest, Errors) {

        var self = this;
        /**
         * Tenders init functions
         */
        self.getTenders = getTenders;
        self.orderList = orderList;


        /**
         * @type {{customUrl: string, Page: number, PerPage: number}}
         * Main tenders config obj
         */
        self.tenderCnfg = {
            customUrl: 'Tender/GetTenders',
            Page: 1,
            PerPage: 15
        };

        /**
         * Get tender list
         */
        // TODO: Check only self.tenderCnfg sending into self.list
        function getTenders() {

            console.log('Высылаю ', self.tenderCnfg);

            self.list = rest.save(MainSettings.serverDirect() + '/api/' + self.tenderCnfg.customUrl, self.tenderCnfg);


            self.list.$promise.then(function (response) {
                self.tenderCnfg.totalCount = response.TotalItemsCount;
                console.log(self.tenderCnfg.customUrl, ': ', response);
            });

        }

        /**
         * @param {string} orderField Obj to sort
         * @param {string} orderBy Sort type
         * Description:
         * Sort function
         */
        function orderList(orderField, orderBy) {
            // OrderBy
            self.tenderCnfg.OrderBy = [];
            self.tenderCnfg.OrderBy.push({
                course: orderBy,
                target: orderField
            });

            getTenders();
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
    function TenderStatsCtrl(rest, $stateParams) {

        var self = this;

        // Get best offers
        self.offers = rest.get({customUrl: 'Tender/GetBestOffers', tenderId: $stateParams.tender});

        self.offers.$promise.then(function (response) {
            console.log('Tender/GetBestOffers ', response);
        });

        // Info about tender
        self.info = rest.get({customUrl: 'Tender/GetTender/', id: $stateParams.tender});

        self.info.$promise.then(function (response) {
            console.log('Tender/GetTender (Info about tender)', response);
        });

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
    function TendersAdd(rest, formSteps, addTenderModel, lodash) {

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
        for(var field in self.addTenderModel) {
            if (self.addTenderModel.hasOwnProperty(field)) {
                console.log(field);
                self.addTenderModel[field] = null;
            }
        }

        // Init date
        var dateToday = new Date();
        self.addTenderModel.StartDate = new Date();
        self.addTenderModel.EndDate = dateToday;
        self.addTenderModel.EndDate.setMonth(dateToday.getMonth() + 1);

        self.categoryList = rest.get({customUrl: 'Tender/GetCategories'});

        function getPositions() {
            self.positionsPreloader = true;
            self.addTenderModel.PositionList = [];
            self.positionsList = rest.get({
                customUrl: 'Position/GetPositions',
                categoryId: self.addTenderModel.CategoryId
            });

            self.positionsList.$promise.then(function (response) {
                self.positionsPreloader = false;

                console.log('Position/GetPositions (Позиции)', response);
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
                    currency: currency
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
            console.log('Отсылаю ', self.addTenderModel);
            rest.save({customUrl: 'Tender/SaveTender'}, self.addTenderModel);
        }

    }

    // Tender Edit
    function TenderEdit(rest, $stateParams, addTenderModel, lodash) {

        var self = this;

        // Init functions
        self.open = open;
        self.setDate = setDate;

        // Add tender model
        self.addTenderModel = addTenderModel;


        // Get tender init
        self.tenderToEdit = rest.get({customUrl: 'Tender/GetTender/', id: $stateParams.tenderToEdit});
        self.tenderToEdit.$promise.then(function (response) {
            console.log('Tender to edit: ', response);

            self.positionsList = rest.get({
                customUrl: 'Position/GetPositions',
                categoryId: response.CategoryId
            });

            // Update add tender model
            self.addTenderModel.Title = response.title;
            self.addTenderModel.StartDate = response.startTime;
            self.addTenderModel.EndDate = response.endTime;
            self.addTenderModel.isActive = response.isActive;
            self.addTenderModel.ForCertificed = response.ForCertificed;
            self.addTenderModel.IsOpenTender = response.isOpenTender;
            self.addTenderModel.CategoryId = response.categoryId;

            // Positions
            self.positionsList = rest.get({
                customUrl: 'Position/GetPositions',
                categoryId: self.addTenderModel.CategoryId
            });
            self.positionsList.$promise.then(function(response) {
                self.addTenderModel.PositionList = response.Result;
            });

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

