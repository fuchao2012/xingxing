define(['jquery',
    'pubsub',
    'kendo',
    'three',
    'scene3d',
    'panelManager',
    'gltfLoader'
], function ($,
             pubsub,
             kendo,
             three,
             scene3d,
             panelManager) {
    return ['$scope', 'dataService', 'events', 'colors', function ($scope, dataService, events, colors) {

        //region -- Fields --

        var scene = null;

        var isOpenPropertyPanel = false;

        var chart = {
            pie: null,
            line: null,
            bar: null
        };

        var chartControl = {
            pie: {
                index: 0,
                id: 'pieContainer'
            },
            line: {
                index: 1,
                id: 'lineContainer'
            },
            bar: {
                index: 2,
                id: 'barContainer'
            }
        };

        var pieChartOption = null;
        var lineChartOption = null;
        var barChartOption = null;

        //endregion

        //region -- Private --

        function update3DScene(url) {
            var element = $('#model3d-container')[0];
            scene = new scene3d(url, element, {
                cameraPos: new three.Vector3(0, 0, 10),
                objectScale: new three.Vector3(1, 1, 1),
                objectPosition: new three.Vector3(0, 0, 0),
                objectRotation: new three.Euler(0, -1 * Math.PI / 6, 0),
                center: new three.Vector3(0, 0, 0),
                animationTime: 3,
                addLights: true,
                shadows: true,
                addGround: false
            });
        }

        function initPieChart() {
            require(['echarts'], function (echarts) {
                chart.pie = echarts.init(document.getElementById('small-pieContainer'));
                pieChartOption = {
                    color: colors,
                    legend: {
                        orient: 'vertical',
                        right: 20,
                        top: 20,
                        textStyle: {
                            color: '#FFF',
                        }
                    },
                    series: {
                        type: 'pie',
                        radius: '90%',
                        center: ['40%', '50%'],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0,0,0,0.5)'
                            }
                        },
                        label: {
                            normal: {
                                position: 'inside',
                                formatter: '{c}'
                            }
                        }
                    }
                };
            });
        }

        function updatePieChart(data) {
            if (!data) return;

            pieChartOption.legend.data = data.legends.map(function (legend) {
                return {
                    name: legend + '',
                    icon: 'rect'
                }
            });
            pieChartOption.series.data = data.values.map(function (value, i) {
                return {
                    name: data.legends[i],
                    value: value
                }
            });
            chart.pie.setOption(pieChartOption);
        }

        function initLineChart() {
            require(['echarts'], function (echarts) {
                chart.line = echarts.init(document.getElementById('small-lineContainer'));
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
                chart.line.setOption(lineChartOption);
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
            chart.line.setOption(lineChartOption);
        }

        function initBarChart() {
            require(['echarts'], function (echarts) {
                chart.bar = echarts.init(document.getElementById('small-barContainer'));
                barChartOption = {
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
                        //boundaryGap: false,
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
                        //boundaryGap: [0, '100%'],
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
                chart.bar.setOption(barChartOption);
            });
        }

        function updateBarChart(data) {
            if (!data) return;

            barChartOption.legend.data = data.legends.map(function (legend) {
                return {
                    name: legend + '',
                    icon: 'rect'
                }
            });
            barChartOption.xAxis.data = data.items.map(function (item) {
                return item.dimension;
            });
            barChartOption.series = data.legends.map(function (legend, i) {
                return {
                    name: legend + '',
                    type: 'bar',
                    stack: '堆积',
                    barWidth: '50%',
                    data: data.items.map(function (item) {
                        return item.values[i];
                    })
                }
            });
            chart.bar.setOption(barChartOption);
        }

        //endregion

        //region -- View Model --

        $scope.showVideosPanel = false;
        $scope.showAudiosPanel = false;
        $scope.showFilesPanel = false;
        $scope.hasBoth2D3D = false;
        $scope.is2DMode = false;
        $scope.showPieChart = true;
        $scope.showLinehart = true;
        $scope.showBarChart = true;

        $scope.switchTo2D = function () {
            $scope.is2DMode = true;
        };

        $scope.switchTo3D = function () {
            $scope.is2DMode = false;
        };

        $scope.interactiveMedia = function (item) {
            console.log(item);
        };

        $scope.interactive = function (item) {
            if (!item || !item.interactive) return;
            console.log("item");
        };

        function selectionChanged(item) {
            console.log("select....")
            if (item) {
                dataService.getDetailInfo(item).then(function (detailInfo) {
                    if (detailInfo) {
                        if (scene) {
                            scene.cleanup();
                        }

                        $scope.detailInfo = detailInfo;
                        $scope.showVideosPanel = detailInfo.videos.length > 0;
                        $scope.showAudiosPanel = detailInfo.audios.length > 0;
                        $scope.showFilesPanel = detailInfo.files.length > 0;
                        $scope.hasBoth2D3D = detailInfo.image && detailInfo.model3D && detailInfo.image !== "" && detailInfo.model3D !== "";
                        if (!$scope.hasBoth2D3D) {
                            if (detailInfo.image && detailInfo.image !== "") {
                                $scope.is2DMode = true;
                            } else if (detailInfo.model3D && detailInfo.model3D !== "") {
                                $scope.is2DMode = false;
                            }
                        }

                        var url = $scope.detailInfo.model3D;
                        if (url && url !== "") {
                            update3DScene(url);
                        }

                        if (!panelManager.detailPanel.isOpen) {
                            panelManager.detailPanel.open();
                        }

                        $scope.showPieChart = $scope.detailInfo.pieChartData != null;
                        $scope.showLinehart = $scope.detailInfo.lineChartData != null;
                        $scope.showBarChart = $scope.detailInfo.barChartData != null;

                        var pie = $scope.detailInfo.pieChartData;
                        var line = $scope.detailInfo.lineChartData;
                        var bar = $scope.detailInfo.barChartData;

                        updatePieChart(pie);
                        updateLineChart(line);
                        updateBarChart(bar);

                        isOpenPropertyPanel = false;
                        $(".detailPanel .scroll-viewer").animate({scrollTop: 0}, "slow");
                    } else {
                        if (panelManager.detailPanel.isOpen) {
                            panelManager.detailPanel.close();
                        }
                    }
                });
            }
        }

        this.$onInit = function () {
            initPieChart();
            initLineChart();
            initBarChart();

            pubsub.subscribe(events.businessSelectionChanged, function (item) {
                selectionChanged(item);
            });
            pubsub.subscribe(events.searchSelectionChanged, function (item) {
                selectionChanged(item);
            });
        };

        //endregion

        /**
         * 控制右侧面板
         */
        this.panelControlHandle = function () {
            var open;
            var $panel = $(".detailPanel");
            if ($panel.css('right') == '0px') {
                panelManager.detailPanel.close();
                open = false;
            } else {
                panelManager.detailPanel.open();
                open = true;
            }

            pubsub.publish(events.panelChanged, {
                name: 'detailPanel',
                open: open
            });
        };

        /**
         * 点击详细链接
         */
        this.detailLinkHandle = function () {
            if (!isOpenPropertyPanel) {
                pubsub.publish(events.detailChanged, $scope.detailInfo);
            }
            isOpenPropertyPanel = true;
            panelManager.propertyPanel.open();
        };

        /**
         * 点击线图查看放大图
         */
        this.clickLineHandle = function () {
            if ($scope.detailInfo && $scope.detailInfo.lineChartData) {
                $(".dialogContainer").dialog('open');
                pubsub.publish(events.dialogLineChanged, $scope.detailInfo.lineChartData);
            }
        }
    }];
});