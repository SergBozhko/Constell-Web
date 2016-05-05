/**
 * Created by admin on 05.05.16.
 */
(function() {

    'use strict';

    angular.module('app.tenders')
        .controller('TendersCtrl', ['rest', TendersCtrl])
        .controller('TenderStatsCtrl', ['rest', '$stateParams', TenderStatsCtrl]);

    // Tenders ctrl
    function TendersCtrl(rest) {

        var self = this;

        self.list = rest.get({customUrl: 'Tender/GetTenders'});

        self.list.$promise.then(function(response) {
            console.log(response);
        });


        // Traffic chart
        self.graph = rest.get({customUrl: 'Tender/GetGraphOfTanders'});
        console.log(self.graph);

        var xAxisData = [];

        self.graph.$promise.then(function(response) {
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
                        type : 'category',
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
                        type : 'value',
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
                        name:'Предложения',
                        type:'line',
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

           response.result.forEach(function(element) {
               self.combo.options.xAxis[0].data.push(element.dayStr);
               self.combo.options.series[0].data.push(element.countOffers);
           });
        });

    }

    // Tender ctrl
    function TenderStatsCtrl(rest, $stateParams) {

        var self = this;

        self.tender = rest.get({customUrl: 'Tender/GetTender/', id: $stateParams.tender});

        self.tender.$promise.then(function(response) {
            console.log(response);
        });

    }

})();

