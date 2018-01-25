define(['require', 'jquery', 'pubsub', 'util', 'jqueryui'], function (require, $, pubsub, util) {

    return ['$scope', 'dataService', 'events', 'colors', function ($scope, dataService, events, colors) {
        var self = this;
        var chart;

        $(".dialogContainer").dialog({
            autoOpen: false,
            width: 615,
            height: 255,
            closeText: '',
            /*show: {
                effect: "blind",
                duration: 1000
            },*/
            position: {
                my: "left+305 top+80",
                at: "left top",
                of: window
            },
            /* hide: {
             effect: "explode",
             duration: 1000
             },*/
            resize: function () {
                chart.resize();
            }
        });

        var lineChartOption = null;

        function initLineChart() {
            require(['echarts'], function (echarts) {
                chart = echarts.init(document.getElementById('dialog-lineContainer'));
                lineChartOption = {
                    grid: {
                        top: '10',
                        left: '10',
                        bottom: '10',
                        right: '100',
                        containLabel: true
                    },
                    color: colors,
                    dataZoom: [{
                        type: 'inside',
                        start: 0,
                        end: 100
                    }],
                    legend: {
                        orient: 'vertical',
                        right: 20,
                        textStyle: {
                            color: '#FFF'
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        position: function (pt) {
                            return [pt[0], '10%'];
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        axisLine: {
                            lineStyle: {
                                color: '#5b5b5b'
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#CCC'
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                type: 'dashed',
                                color: '#CCC'
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: [0, '100%'],
                        axisLine: {
                            lineStyle: {
                                color: '#5b5b5b'
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#CCC'
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                type: 'dashed',
                                color: '#565656'
                            }
                        }
                    },
                    series: []
                };
                chart.setOption(lineChartOption);
            });
        }

        function updateLineChart(data) {
            if (!data) return;

            lineChartOption.legend.data = data.legends.map(function (legend) {
                return {
                    name: legend + '',
                    icon: 'rect'
                }
            });
            lineChartOption.xAxis.data = data.items.map(function (item) {
                return item.dimension;
            });
            lineChartOption.series = data.legends.map(function (legend, i) {
                return {
                    name: legend + '',
                    type: 'line',
                    data: data.items.map(function (item) {
                        return item.values[i];
                    })
                }
            });
            chart.setOption(lineChartOption);
            chart.resize();
        }

        this.$onInit = function () {
            initLineChart();

            pubsub.subscribe(events.dialogLineChanged, function (data) {
                updateLineChart(data);
            });
        };
    }];
});