define([
    'app',
    'jquery',
    'models/managePanel.models',
    'models/statisticsPanel.models',
    'models/linePanel.models',
    'models/mapPanel.models',
    'models/treeViewItem.model',
    'models/battle.model',
    'models/detail.model',
    'models/business.model'
], function (app,
             $,
             managePanelModels,
             statisticsPanelModels,
             linePanelModels,
             mapPanelModels,
             treeView,
             Battle,
             detailModels,
             business) {
    app.service('dataService', ['$http', function ($http) {

        /**
         * 查询搜索数据
         * @param param
         * @returns {Promise}
         */
        this.getSearchData = function (param) {
            return new Promise(function (resolve, reject) {

                var result = {
                    "list": [
                        {
                            type: '产品',
                            name: '产品',
                            information: '东风-41'
                        },
                        {
                            type: '机构',
                            name: '机构',
                            information: '一级机构1'
                        },
                        // {
                        //     type: '产品',
                        //     name: '产品',
                        //     information: '北风之神'
                        // }
                    ]
                };

                var data = [];
                for (var i = 0, len = result.list.length; i < len; i++) {
                    var item = result.list[i];
                    var p = new managePanelModels.SearchData();
                    p.type = item.type;
                    p.name = item.name;
                    p.information = item.information;
                    data.push(p);
                }
                resolve(data);
            });
        };

        /**
         * 查询统计面板的数据
         * @param param
         * @returns {Promise}
         */
        this.getStatisticsData = function (param) {
            return new Promise(function (resolve, reject) {

                var result = {
                    "organization": 1000,
                    "product": 2000,
                    "technology": 1500
                };

                var data = new statisticsPanelModels.StatisticsData();
                data.organization = result.organization;
                data.product = result.product;
                data.technology = result.technology;
                resolve(data);
            });
        };

        /**
         * 根据对象获取对象详细信息
         * @param param
         */
        this.getDetailInfo = function (param) {
            function analyzeTreeViewItem(items, dataItem){
                if(null == items || null == dataItem) return;

                var text = dataItem.value;
                var treeViewItem = new treeView.TreeViewItem(dataItem, text);

                var dataChildren = dataItem.items;
                if(null != dataChildren){
                    var length = dataChildren.length;
                    for(var i = 0; i < length; i++){
                        var child = dataChildren[i];
                        analyzeTreeViewItem(treeViewItem.items, child);
                    }
                }

                items.push(treeViewItem);
            }

            return new Promise(function (resolve, reject) {
                $.getJSON("test/detailInfo.json", function (data) {
                    console.log(data)
                    var name = data["name"];
                    var type = data["type"];
                    var desc = data["desc"];
                    var image = data["image"];
                    var model3D = data["model3D"];

                    // var image = undefined;
                    // var model3D = "";
                    var detailInfo = new detailModels.DetailInfo(name, type, desc, image, model3D);
                    detailInfo.icon = "images/technology-icon.png";

                    var listMembers = data["listMembers"];
                    var length = listMembers.length;
                    for (var i = 0; i < length; i++) {
                        var member = listMembers[i];
                        var merberName = member.name;

                        var tree = new detailModels.Tree(merberName);

                        for(var j = 0; j < member.items.length; j++){
                            var item = member.items[j];
                            analyzeTreeViewItem(tree.items, item);
                        }

                        detailInfo.listMembers.push(tree);
                    }

                    var tableMembers = data["tableMembers"];
                    for (var i = 0; i < tableMembers.length; i++) {
                        var member = tableMembers[i];
                        var tableName = member.name;

                        var table = new detailModels.Table(tableName);
                        var columns = member.columns;
                        for (var x = 0; x < columns.length; x++) {
                            table.columns.push(columns[x]);
                        }

                        var rows = member.rows;
                        for (var j = 0; j < rows.length; j++) {
                            var row = member.rows[j];

                            var tableRow = new detailModels.TableRow();
                            for (var n = 0; n < row.cells.length; n++) {
                                var cell = row.cells[n];
                                var tableCell = new detailModels.TableCell(cell.value, cell.interactive);
                                tableRow.cells.push(tableCell);
                            }

                            table.rows.push(tableRow);
                        }

                        detailInfo.tableMembers.push(table);
                    }

                    var pieChartData = data["pie"];
                    if (pieChartData) {
                        var pie = new detailModels.Pie();
                        pie.legends = pieChartData.legends;
                        pie.values = pieChartData.values;
                        detailInfo.pieChartData = pie;
                    }

                    var lineChartData = data["line"];
                    if (lineChartData) {
                        var line = new detailModels.Line();
                        line.legends = lineChartData.legends;
                        for (var i = 0; i < lineChartData.items.length; i++) {
                            var lineItem = new detailModels.LineItem();
                            lineItem.dimension = lineChartData.items[i].dimension;
                            lineItem.values = lineChartData.items[i].values;
                            line.items.push(lineItem);
                        }
                        detailInfo.lineChartData = line;
                    }

                    var barChartData = data["bar"];
                    if (barChartData) {
                        var bar = new detailModels.Bar();
                        bar.legends = barChartData.legends;
                        for (var i = 0; i < barChartData.items.length; i++) {
                            var barItem = new detailModels.BarItem();
                            barItem.dimension = barChartData.items[i].dimension;
                            barItem.values = barChartData.items[i].values;
                            bar.items.push(barItem);
                        }
                        detailInfo.barChartData = bar;
                    }

                    for (var x = 0; x < data.videos.length; x++) {
                        detailInfo.videos.push(data.videos[x]);
                    }

                    for (var x = 0; x < data.audios.length; x++) {
                        detailInfo.audios.push(data.audios[x]);
                    }

                    for (var x = 0; x < data.files.length; x++) {
                        detailInfo.files.push(data.files[x]);
                    }

                    resolve(detailInfo);
                });
            });
        };

        /**
         * 查询线图数据
         * @param param
         * @returns {Promise}
         */
        this.getLineData = function (param) {
            return new Promise(function (resolve, reject) {

                var result = [
                    {
                        time: '1月',
                        organization: {
                            name: '机构',
                            value: Math.random() * 100
                        },
                        product: {
                            name: '产品',
                            value: Math.random() * 100
                        },
                        technology: {
                            name: '技术',
                            value: Math.random() * 100
                        }
                    }, {
                        time: '2月',
                        organization: {
                            name: '机构',
                            value: Math.random() * 100
                        },
                        product: {
                            name: '产品',
                            value: Math.random() * 100
                        },
                        technology: {
                            name: '技术',
                            value: Math.random() * 100
                        }
                    }, {
                        time: '3月',
                        organization: {
                            name: '机构',
                            value: Math.random() * 100
                        },
                        product: {
                            name: '产品',
                            value: Math.random() * 100
                        },
                        technology: {
                            name: '技术',
                            value: Math.random() * 100
                        }
                    }, {
                        time: '4月',
                        organization: {
                            name: '机构',
                            value: Math.random() * 100
                        },
                        product: {
                            name: '产品',
                            value: Math.random() * 100
                        },
                        technology: {
                            name: '技术',
                            value: Math.random() * 100
                        }
                    }, {
                        time: '5月',
                        organization: {
                            name: '机构',
                            value: Math.random() * 100
                        },
                        product: {
                            name: '产品',
                            value: Math.random() * 100
                        },
                        technology: {
                            name: '技术',
                            value: Math.random() * 100
                        }
                    }
                ];

                var data = [];
                for (var i = 0, len = result.length; i < len; i++) {
                    var item = result[i];
                    var p = new linePanelModels.Line();
                    p.time = item.time;
                    var organizationProperty = new linePanelModels.LineProperty();
                    organizationProperty.name = item.organization.name;
                    organizationProperty.value = item.organization.value;
                    p.properties.push(organizationProperty);
                    var productProperty = new linePanelModels.LineProperty();
                    productProperty.name = item.product.name;
                    productProperty.value = item.product.value;
                    p.properties.push(productProperty);
                    var technologyProperty = new linePanelModels.LineProperty();
                    technologyProperty.name = item.technology.name;
                    technologyProperty.value = item.technology.value;
                    p.properties.push(technologyProperty);
                    data.push(p);
                }
                resolve(data);
            });
        };

        /**
         * 查询所有机构数据
         */
        this.getOrgBusinessData = function () {
            function detectOrgs(treeViewItem, orgs) {

                var orgName = orgs.name;
                if (!orgName) return;

                var treeViewItem1 = new treeView.TreeViewItem(orgs, orgName);
                treeViewItem.Items.push(treeViewItem1);

                var branchOrgs = orgs.orgs;
                if (branchOrgs) {
                    var length = branchOrgs.length;
                    for (var i = 0; i < length; i++) {
                        var org = branchOrgs[i];
                        var orgName = org.name;

                        var treeViewItem2 = new treeView.TreeViewItem(org, orgName);
                        treeViewItem1.Items.push(treeViewItem2);
                    }
                }

                if (orgs.branches && orgs.branches instanceof Array) {
                    for (var j = 0; j < orgs.branches.length; j++) {
                        var orgs2 = orgs.branches[j];
                        detectOrgs(treeViewItem1, orgs2);
                    }
                }
            }

            return new Promise(function (fullfilled, reject) {

                $.getJSON('test/orgTestData.json', function (data) {

                    var treeViewItems = [];
                    for (var i = 0; i < data.length; i++) {
                        var country = data[i];
                        var countryName = country.country;
                        var treeViewItem1 = new treeView.TreeViewItem(country, countryName);

                        var orgs = country.level;
                        detectOrgs(treeViewItem1, orgs);

                        treeViewItems.push(treeViewItem1);
                    }

                    fullfilled(treeViewItems);
                });

            });
        };

        /**
         * 查询所有产品数据
         */
        this.getProductBusinessData = function () {
            return new Promise(function (fullfilled, reject) {

                $.getJSON('test/productTestData.json', function (data) {

                    var treeViewItems = [];
                              console.log(data[0])
                    for (var i = 0; i < data.length; i++) {
                        var category = data[i];
                        var categoryName = category.category;
                       
                        var treeView1 = new treeView.TreeViewItem(category, categoryName);

                        for (var j = 0; j < category.area.length; j++) {
                            var area = category.area[j];
                            var areaName = area.category;
                            var treeView2 = new treeView.TreeViewItem(area, areaName);

                            for (var x = 0; x < area.countries.length; x++) {
                                var country = area.countries[x];
                                var countryName = country.name;
                                var treeView3 = new treeView.TreeViewItem(country, countryName);

                                for (var n = 0; n < country.models.length; n++) {
                                    var model = country.models[n];
                                    var modelName = model.name;
                                    var treeView4 = new treeView.TreeViewItem(model, modelName);
                                    treeView3.Items.push(treeView4);
                                }

                                treeView2.Items.push(treeView3);
                            }

                            treeView1.Items.push(treeView2);
                        }
                       
                        treeViewItems.push(treeView1);
                    }
                       console.log(treeViewItems,"dfasdfasdf")
                    fullfilled(treeViewItems);
                });
            });
        };

        /**
         * 查询所有技术数据
         */
        this.getTechBusinessData = function () {
            return new Promise(function (fullfilled, reject) {

                $.getJSON('test/techTestData.json', function (data) {

                    var treeViewItems = [];

                    for (var i = 0; i < data.length; i++) {
                        var category = data[i];
                        var categoryName = category.category;
                        var treeView1 = new treeView.TreeViewItem(category, categoryName);

                        for (var j = 0; j < category.area.length; j++) {
                            var area = category.area[j];
                            var areaName = area.category;
                            var treeView2 = new treeView.TreeViewItem(area, areaName);

                            for (var x = 0; x < area.countries.length; x++) {
                                var country = area.countries[x];
                                var countryName = country.name;
                                var treeView3 = new treeView.TreeViewItem(country, countryName);

                                for (var n = 0; n < country.teches.length; n++) {
                                    var tech = country.teches[n];
                                    var techName = tech.name;
                                    var treeView4 = new treeView.TreeViewItem(tech, techName);
                                    treeView3.Items.push(treeView4);
                                }

                                treeView2.Items.push(treeView3);
                            }

                            treeView1.Items.push(treeView2);
                        }

                        treeViewItems.push(treeView1);
                    }

                    fullfilled(treeViewItems);
                });

            });
        };

        /**
         * 获取所有战场态势信息
         */
        this.getBattles = function () {
            return new Promise(function (fullfilled, reject) {
                var  battles = [];
                $.getJSON('test/battlefield.json', function (data) {
                        var temp_obj
                    for(var i=0;i<data.length;i++){
                         temp_obj=data[i];
                         var child=[];
                         if(temp_obj.child){
                            child=temp_obj.child;
                         }
                         var b=new Battle(temp_obj.name,temp_obj.type,temp_obj.id,child);
                         battles.push(b);
                    }
                });

                // for (var i = 0; i < 20; i++) {
                //     var name = "战场00" + i.toString();
                //     var b = new Battle(name, "2017/05/09 12:01:06");
                //     battles.push(b);
                // }

                fullfilled(battles);
            });
        };


        /**
         * 根据选中的组织机构查询其详细信息
         * @param org
         */
        this.getOrgDetailInfo = function (org) {
            return new Promise(function (fullfilled, reject) {
                fullfilled({});
            });
        };

        /**
         * 根据选中的产品查询其详细信息
         * @param product
         */
        this.getProductDetailInfo = function (product) {
            return new Promise(function (fullfilled, reject) {
                fullfilled({});
            });
        };

        /**
         * 根据选中的技术查询其详细信息
         * @param tech
         */
        this.getTechDetailInfo = function (tech) {
            return new Promise(function (fullfilled, reject) {
                fullfilled({});
            });
        };

        /**
         * 获取地图数据
         * @param param
         * @returns {Promise}
         */
        this.getMapData = function (param) {
            return new Promise(function (resolve, reject) {

                var time = new Date();
                var result = [
                    {
                        time: time,
                        organizations: [
                            {
                                name: 'organization1',
                                longitude: 50 + Math.random() * 100,
                                latitude: 0 + Math.random() * 50,
                                id: '1',
                                correlation: [{
                                    name: 'organization2',
                                    longitude: 50 + Math.random() * 100,
                                    latitude: 0 + Math.random() * 50,
                                    id: '2',
                                    correlation: [{
                                        name: 'organization3',
                                        longitude: 50 + Math.random() * 100,
                                        latitude: 0 + Math.random() * 50,
                                        id: '3',
                                        correlation: [{
                                            name: 'organization1',
                                            longitude: 50 + Math.random() * 100,
                                            latitude: 0 + Math.random() * 50,
                                            id: '1',
                                            correlation: []
                                        }]
                                    }]
                                }, {
                                    name: 'organization4',
                                    longitude: 50 + Math.random() * 100,
                                    latitude: 0 + Math.random() * 50,
                                    id: '4',
                                    correlation: []
                                }]
                            }
                        ],
                        products: [
                            {
                                name: 'product1',
                                longitude: 125,
                                latitude: 55,
                                id: '1',
                            }
                        ]
                    }
                ];

                function getResult(time) {
                    var n = 5;

                    function getOrganization() {
                        return {
                            name: 'organization',
                            longitude: 50 + Math.random() * 100,
                            latitude: 0 + Math.random() * 50,
                            id: n++ + '',
                            correlation: [
                                {
                                    name: 'organization',
                                    longitude: 50 + Math.random() * 100,
                                    latitude: 0 + Math.random() * 50,
                                    id: n++ + '',
                                    correlation: []
                                }
                            ]
                        }
                    }

                    var result = {
                        time: time,
                        organizations: [
                            {
                                name: 'organization1',
                                longitude: 50 + Math.random() * 100,
                                latitude: 0 + Math.random() * 50,
                                id: '1',
                                correlation: [
                                    {
                                        name: 'organization2',
                                        longitude: 50 + Math.random() * 100,
                                        latitude: 0 + Math.random() * 50,
                                        id: '2',
                                        correlation: [
                                            {
                                                name: 'organization3',
                                                longitude: 50 + Math.random() * 100,
                                                latitude: 0 + Math.random() * 50,
                                                id: '3',
                                                correlation: [{
                                                    name: 'organization1',
                                                    longitude: 50 + Math.random() * 100,
                                                    latitude: 0 + Math.random() * 50,
                                                    id: '1',
                                                    correlation: []
                                                }]
                                            }]
                                    },
                                    {
                                        name: 'organization4',
                                        longitude: 50 + Math.random() * 100,
                                        latitude: 0 + Math.random() * 50,
                                        id: '4',
                                        correlation: []
                                    }]
                            }
                        ],
                        products: [
                            {
                                name: 'product1',
                                longitude: 125,
                                latitude: 55,
                                id: '1',
                            }
                        ]
                    };

                    for (var i = 0; i < 3; i++) {
                        result.organizations.push(getOrganization());
                    }

                    return result;
                }

                for (var i = 0; i < 99; i++) {
                    result.push(getResult(new Date(time.getTime() + i * 1000)));
                }

                var getCorrelation = function (constructor, data) {
                    var result = new constructor();
                    result.id = data.id;
                    result.name = data.name;
                    result.longitude = data.longitude;
                    result.latitude = data.latitude;
                    if (data.correlation && data.correlation.length > 0) {
                        data.correlation.forEach(function (d) {
                            result.correlation.push(getCorrelation(constructor, d));
                        });
                    }
                    return result;
                };

                var data = [];
                for (var i = 0, len = result.length; i < len; i++) {
                    var item = result[i];
                    var p = new mapPanelModels.MapData()
                    p.time = new Date(item.time);
                    item.organizations.forEach(function (d) {
                        p.organizations.push(getCorrelation(mapPanelModels.Organization, d))
                    });
                    item.products.forEach(function (d) {
                        p.products.push(getCorrelation(mapPanelModels.Product, d))
                    });
                    data.push(p);
                }
                resolve(data);
            });
        };

        
        /**
         * 获取高级搜索领域下拉框列表
         * @returns {Promise}
         */
        this.getSearchFields = function () {
            return new Promise(function (resolve, reject) {
                var result = [
                    '领域1',
                    '领域2',
                    '领域3'
                ];

                resolve(result);
            });
        };

        /**
         * 获取高级搜索机构下拉框列表
         * @returns {Promise}
         */
        this.getSearchOrganizations = function () {
            function detectOrgs(treeViewItem, orgs) {

                var orgName = orgs.name;
                if (!orgName) return;

                var treeViewItem1 = new treeView.TreeViewItem(orgs, orgName);
                treeViewItem.Items.push(treeViewItem1);

                var branchOrgs = orgs.orgs;
                if (branchOrgs) {
                    var length = branchOrgs.length;
                    for (var i = 0; i < length; i++) {
                        var org = branchOrgs[i];
                        var orgName = org.name;

                        var treeViewItem2 = new treeView.TreeViewItem(org, orgName);
                        treeViewItem1.Items.push(treeViewItem2);
                    }
                }

                if (orgs.branches && orgs.branches instanceof Array) {
                    for (var j = 0; j < orgs.branches.length; j++) {
                        var orgs2 = orgs.branches[j];
                        detectOrgs(treeViewItem1, orgs2);
                    }
                }
            }

            return new Promise(function (fullfilled, reject) {

                $.getJSON('test/orgTestData.json', function (data) {

                    var treeViewItems = [];
                    for (var i = 0; i < data.length; i++) {
                        var country = data[i];
                        var countryName = country.country;
                        var treeViewItem1 = new treeView.TreeViewItem(country, countryName);

                        var orgs = country.level;
                        detectOrgs(treeViewItem1, orgs);

                        treeViewItems.push(treeViewItem1);
                    }

                    fullfilled(treeViewItems);
                });

            });
            /* return new Promise(function (resolve, reject) {
             var result = [
             '机构1',
             '机构2',
             '机构3'
             ];
             resolve(result);
             });*/
        };

        /**
         * 获取高级搜索类型下拉框列表
         * @returns {Promise}
         */
        this.getSearchTypes = function () {
            return new Promise(function (resolve, reject) {
                var result = [
                    '类型1',
                    '类型2',
                    '类型3'
                ];
                resolve(result);
            });
        };

        /**
         * 获取业务类型结合
         */
        this.getBusinessList = function () {
            return new Promise(function (resolve, reject) {
                var result = [
                    new business("产品", true),
                    new business("机构"),
                    new business("技术")
                ];
                resolve(result);
            });
        };

    }]);
});