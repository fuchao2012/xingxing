define(['jquery',
    'pubsub'], function ($,
                         pubsub) {
    return ['$scope', 'dataService', 'events', function ($scope, dataService, events) {

        //region -- Fields --

        var self = this;
        // 上一次选中的业务名称
        var lastBusiness = null;
        // treeView控件引用
        var treeView = null;

        var selectedItem = null;

        //endregion

        //region -- Private

        function onBusinessChanged(business) {
            if (!business) return null;

            var promise = null;

            // 机构
            if (business.name === "机构") {
                promise = dataService.getOrgBusinessData();
            }
            // 产品
            else if (business.name === "产品") {
                promise = dataService.getProductBusinessData();
            }
            // 技术
            else if (business.name === "技术") {
                promise = dataService.getTechBusinessData();
            }

            if (null != promise) {
                return promise.then(function (data) {
                    treeView.setDataSource(data);
                });
            }

            return null;
        }

        function changeSelectedButton($element, business) {
            if ($element) {
                var $prevs = $element.prevAll();
                var $nexts = $element.nextAll();

                $element.addClass("select");
                $prevs.removeClass("select");
                $nexts.removeClass("select");
            }

            if (lastBusiness !== business) {
                lastBusiness = business;
                return onBusinessChanged(business);
            }

            return null;
        }

        function onTabButtonClick($event, business) {
            var $element = $($event.currentTarget);
            changeSelectedButton($element, business);
        }
        
        function selectItem(data){
            if(selectedItem === data) return;

            selectedItem = data;
            var linePromise = dataService.getLineData(data);
            var mapPromise = dataService.getMapData(data);

            Promise.all([linePromise, mapPromise]).then(function (values) {
                pubsub.publish(events.businessSelectionChanged, {
                    "lineData": values[0],
                    "mapData": values[1]
                });
            });
        }

        function onTreeViewSelected(event) {
            console.log("aaaaaa")
            var treeViewItem = treeView.dataItem(event.node);
            if (null != treeViewItem && null != treeViewItem.data && treeViewItem.items.length == 0) {
                var data = treeViewItem.data;
                selectItem(data);
            }
        }

        function syncSelectionTreeViewItem(treeViewItems, searchData) {
            var hasFound = false;
            var length = treeViewItems.length;
            for (var i = 0; i < length && !hasFound; i++) {
                var treeViewItem = treeViewItems[i];
                var data = treeViewItem.data;
                if (treeViewItem.items.length > 0) {
                    hasFound = syncSelectionTreeViewItem(treeViewItem.items, searchData);
                    if (hasFound){
                        treeViewItem.set("expanded", true);
                        break;
                    }
                } else if (data.name === searchData.information) {

                    // treeView的API不好使，没法调试，所以把代码单独提出来
                    treeView.element.find(".k-state-selected").each(function () {
                        var item = treeView.dataItem(this);
                        item.set("selected", false);
                    });

                    treeViewItem.set("selected", true);
                    var $item = treeView.findByUid(treeViewItem.uid);
                    var offset = $item.offset();

                    var $treeView = $("#treeViewPanel");
                    var treeOffset = $treeView.offset();

                    // 计算节点距离树容器顶部的相对高度，并修正一行的高度
                    var relativeY = offset.top - treeOffset.top - 25;
                    $treeView[0].scrollTop = relativeY;

                    selectItem(treeViewItem.data);

                    hasFound = true;
                    break;
                }
            }

            return hasFound;
        }

        function syncSearchResult(searchData) {
            var business = null;
            for (var i = 0; i < $scope.businessList.length; i++) {
                if ($scope.businessList[i].name === searchData.type) {
                    business = $scope.businessList[i];
                    break;
                }
            }

            if (null == business) return;

            $("#businessPresentationBlock .imageButton").each(function (index, element) {
                var $element = $(element);
                var data = $element.data();
                if (!data) return;

                if (data.name === business.name) {
                    var promise = changeSelectedButton($element, business);
                    if (null != promise) {
                        promise.then(function () {
                            var dataSource = treeView.dataSource.view();
                            syncSelectionTreeViewItem(dataSource, searchData);
                        });
                    } else {
                        var dataSource = treeView.dataSource.view();
                        syncSelectionTreeViewItem(dataSource, searchData);
                    }
                }
            });
        }

        //endregion

        $scope.onTabButtonClick = onTabButtonClick;
        $scope.onBusinessChanged = onBusinessChanged;
        $scope.businessList = [];
        $scope.defaultBusiness = null;

        this.$onInit = function () {

            dataService.getBusinessList().then(function (businesses) {
                $scope.businessList = businesses;

                var length = $scope.businessList.length;
                for (var i = 0; i < length; i++) {
                    var business = $scope.businessList[i];
                    if (business.isDefault) {
                        $scope.defaultBusiness = business;
                        break;
                    }
                }

                if (!$scope.defaultBusiness && length > 0) {
                    $scope.defaultBusiness = $scope.businessList[0];
                }

                // 初始化树
                var $treeView = $("#treeViewPanel");
                $treeView.kendoTreeView({
                    dataSource: [],
                    select: onTreeViewSelected
                });
                treeView = $treeView.data("kendoTreeView");

                // 初始化默认选中按钮
                changeSelectedButton(null, $scope.defaultBusiness);
            });

            pubsub.subscribe(events.searchChanged, function (searchResult) {
                if (searchResult instanceof Array && searchResult.length > 0) {
                    syncSearchResult(searchResult[0]);
                }
            });
        };
    }];
});