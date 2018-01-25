define(['pubsub', 'util'], function (pubsub, util) {
    return ['$scope', 'dataService', 'events', 'searchCheck', 'country', function ($scope, dataService, events, searchCheck, country) {
        var self = this;
        /**
         * 搜索框
         * @type {string}
         */
        this.searchText = '';
        /**
         * 搜索结果列表
         * @type {Array}
         */
        this.searchList = [];
        /**
         * 是否显示高级搜索
         * @type {boolean}
         */
        this.showDetail = false;
        /**
         * 是否显示搜索列表
         * @type {boolean}
         */
        this.searchListShow = false;

        /**
         * 是否显示搜索历史
         * @type {boolean}
         */
        this.searchHistoryListShow = false;

        /**
         * 搜索历史列表
         * @type {Array}
         */
        this.searchHistortList = [];

        /**
         * 搜索列表图片映射
         * @type {{organization: string, product: string}}
         */
        this.images = {
            '机构': 'images/organization-l.png',
            '产品': 'images/product-l.png'
        };

        /**
         * 勾选框
         */
        this.checks = searchCheck.map(function (d) {
            return {
                name: d,
                checked: false
            }
        });

        /**
         * 全部点击
         */
        this.allCheckedHandle = function () {
            self.checks.forEach(function (d) {
                d.checked = self.allChecked;
            });
        };

        /**
         * 勾选框勾选事件
         */
        this.checkItemHandle = function (data) {
            var allChecked = true;
            for (var i = 0, len = self.checks.length; i < len; i++) {
                if (!self.checks[i].checked) {
                    allChecked = false;
                    break;
                }
            }
            self.allChecked = allChecked;
        };

        /**
         * 国家绑定字段
         * @type {{allCheck: boolean, checkContent: string}}
         */
        this.countryCheck = {
            allCheck: true,
            checkContent: ''
        };

        /**
         * 国家列表
         */
        this.countries = country.map(function (data) {
            return {
                checked: true,
                opened: true,
                openStyle: {
                    backgroundImage: getOpenImage(true)
                },
                continent: data.continent,
                countries: data.countries.map(function (d) {
                    return {
                        checked: true,
                        name: d
                    }
                })
            };
        });

        //初始化时获取国家选择框内容
        getCountryContent();

        /**
         * 高级搜索领域
         * @type {string}
         */
        this.field = '';
        this.fields = [];
        dataService.getSearchFields()
            .then(function (data) {
                self.fields = data;
            });

        /**
         * 高级搜索机构
         * @type {string}
         */
        this.organization = '';
        this.organizations = [];
        dataService.getSearchOrganizations()
            .then(function (data) {
                self.organizations = data;
            });

        /**
         * 高级搜索类型
         * @type {string}
         */
        this.type = '';
        this.types = [];
        dataService.getSearchTypes()
            .then(function (data) {
                self.types = data;
            });

        /**
         * 更新搜索结果
         */
        function updateSearchData(callback) {
            var types = (function () {
                var result = [];
                self.checks.forEach(function (d) {
                    if (d.checked) {
                        result.push(d.name);
                    }
                });
                return result;
            })();
            var countries = (function () {
                var result = [];
                self.countries.forEach(function (d) {
                    d.countries.forEach(function (e) {
                        if (e.checked) {
                            result.push(e.name);
                        }
                    })
                });
                return result;
            })();
            var param = {
                keyword: self.searchText,
                types: types,
                advancedSearch: self.showDetail,
                countries: countries,
                field: self.field,
                organization: self.organization,
                type: self.type
            };
            dataService.getSearchData(param)
                .then(function (data) {
                    util.safeApply($scope, function () {
                        self.searchList = data;
                        callback && callback(data);
                    });

                });
        }

        /**
         * 获取展开时和收起时图片
         * @param open
         * @returns {*}
         */
        function getOpenImage(open) {
            if (open) {
                return 'url(images/treeitem-expand.png)';
            } else {
                return 'url(images/treeitem-collapse.png)'
            }
        }

        /**
         * 获取国家选择框选择内容
         */
        function getCountryContent() {
            if (self.countryCheck.allCheck) {
                self.countryCheck.checkContent = '全部国家';
            } else {
                var content = [];
                self.countries.forEach(function (d) {
                    d.countries.forEach(function (p) {
                        if (p.checked) {
                            content.push(p.name);
                        }
                    });
                });
                self.countryCheck.checkContent = content.join(',');
            }
        }

        /**
         * 搜索结果点击事件
         * @param data
         */
        this.clickSearchItemHandle = function (data) {

            var linePromise = dataService.getLineData(data);
            var mapPromise = dataService.getMapData(data);

            Promise.all([linePromise, mapPromise]).then(function (values) {
                pubsub.publish(events.searchSelectionChanged, {
                    "lineData": values[0],
                    "mapData": values[1]
                });
            });
        };

        /**
         * 搜索按钮点击事件
         */
        this.searchHandle = function () {
            //显示搜索结果
            this.searchListShow = true;
            //更新搜索内容
            updateSearchData(function (data) {
                //发布搜索完成事件
                pubsub.publish(events.searchChanged, data);
                //更新搜索历史
                self.searchHistortList = data.concat(self.searchHistortList.filter(function (e) {
                    var contain = false;
                    for (var i = 0, len = data.length; i < len; i++) {
                        if (data[i].name == e.name) {
                            contain = true;
                            break;
                        }
                    }
                    return !contain;
                }));
            });
        };

        //region -- 国家选择框 --

        /**
         * 全部国家点击事件
         * @param $event
         */
        this.continentAllCheckHandle = function ($event) {
            $event.stopPropagation();
            this.countries.forEach(function (data) {
                data.checked = self.countryCheck.allCheck;
                data.countries.forEach(function (d) {
                    d.checked = self.countryCheck.allCheck;
                });
            });
            getCountryContent();
        };

        /**
         * 国家选择框洲选择框点击事件
         * @param $event
         * @param data
         */
        this.continentCheckHandle = function ($event, data) {
            $event.stopPropagation();
            data.countries.forEach(function (d) {
                d.checked = data.checked;
            });
            //判断全部节点
            var isAllChecked = true;
            for (var i = 0, len = self.countries.length; i < len; i++) {
                if (!self.countries[i].checked) {
                    isAllChecked = false;
                    break;
                }
            }
            self.countryCheck.allCheck = isAllChecked;
            getCountryContent();
        };

        /**
         * 国家选择框洲展开事件
         */
        this.continentOpenHandle = function ($event, data) {
            $event.stopPropagation();
            data.opened = !data.opened;
            data.openStyle.backgroundImage = getOpenImage(data.opened);
        };

        /**
         * 国家选择框点击事件
         * @param $event
         * @param data
         */
        this.countryCheckHandle = function ($event, data) {
            $event.stopPropagation();
            //判断父级节点
            var checked = true;
            for (var i = 0, len = data.countries.length; i < len; i++) {
                if (!data.countries[i].checked) {
                    checked = false;
                    break;
                }
            }
            data.checked = checked;
            //判断全部节点
            var isAllChecked = true;
            for (var i = 0, len = self.countries.length; i < len; i++) {
                if (!self.countries[i].checked) {
                    isAllChecked = false;
                    break;
                }
            }
            self.countryCheck.allCheck = isAllChecked;
            getCountryContent();
        };

        //endregion
    }];
});