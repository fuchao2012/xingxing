define(['jquery', 'app', 'util'], function ($, app, util) {
    app.directive('selectList', function () {
        return {
            restrict: 'A',
            scope: {
                content: '=content',
                list: '=list'
            },
            template: '<div>\
                    <div ng-style="selectInputStyle" ng-click="selectHandle($event)">\
                        <span ng-bind="content" ng-style="contentStyle"></span>\
                        <a ng-style="arrowStyle"></a>\
                    </div>\
                    <div ng-if="listType==\'single\'" ng-style="selectListStyle" ng-show="open">\
                        <ul>\
                            <li \
                            ng-style="selectItemStyle" \
                            ng-click="selectItemHandle(data,$event)"\
                            ng-repeat="data in list"\
                            ng-bind="data"\
                            ng-mouseenter="selectItemEnterHandle($event)" \
                            ng-mouseleave="selectItemLeaveHandle($event)" \
                            ></li>\
                        </ul>\
                    </div>\
                    <div class="multiSelect" ng-if="listType==\'multi\'" ng-style="selectListStyle" ng-show="open">\
                    </div>\
                    <div ng-if="!list" ng-style="selectListStyle" ng-show="open" ng-transclude>\
                    </div>\
                </div>',
            replace: true,
            transclude: true,
            link: function (scope, element, attrs) {
                scope.open = false;
                scope.selectInputStyle = {
                    position: 'relative',
                    border: '1px solid #666',
                    width: '100%',
                    height: '100%',
                    background: '#000',
                    cursor: 'pointer'
                };

                scope.contentStyle = {
                    width: '100%',
                    height: '100%',
                    paddingLeft: '5px',
                    overflow: 'hidden'
                };

                scope.arrowStyle = {
                    position: 'absolute',
                    right: '5px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    borderTop: '4px solid #FFF',
                    borderLeft: '4px solid transparent',
                    borderRight: '4px solid transparent',
                };

                scope.selectListStyle = {
                    position: 'relative',
                    border: '1px solid #666',
                    borderTop: 0,
                    cursor: 'pointer',
                    zIndex: 1,
                    background: '#000',
                    maxHeight: '300px',
                    overflowY: 'auto'
                };

                scope.selectItemStyle = {
                    width: '100%',
                    height: '25px',
                    paddingLeft: '5px'
                };

                function getListType(list) {
                    if (list && list.length > 0) {
                        if (typeof list[0] == 'string') {
                            //单级
                            return 'single'
                        } else {
                            //多级
                            return 'multi';
                        }
                    }
                }

                function onTreeViewSelected(data) {
                    //这里取全局的event事件 todo
                    window.event.stopPropagation();
                    var treeViewItem = treeView.dataItem(data.node);
                    util.safeApply(scope, function () {
                        scope.content = treeViewItem.text;
                    })
                }

                function onCollapse() {
                    window.event.stopPropagation();
                }

                function onExpand() {
                    window.event.stopPropagation();
                }

                //region -- 初始化 --
                var treeView;
                scope.$watch("list", function () {
                    scope.listType = getListType(scope.list);
                    //在dom节点加载之后加载树
                    setTimeout(function () {
                        if (getListType(scope.list) == 'multi') {
                            if (!treeView) {
                                scope.selectListStyle.padding = '10px';
                                //采用kendo组件
                                var $treeView = element.find('.multiSelect');
                                $treeView.kendoTreeView({
                                    dataSource: scope.list,
                                    select: onTreeViewSelected,
                                    collapse: onCollapse,
                                    expand: onExpand
                                });
                                treeView = $treeView.data("kendoTreeView");
                                treeView.setDataSource(scope.list);
                            }
                        }
                    }, 0);
                });
                //endregion

                function resetOpen() {
                    util.safeApply(scope, function () {
                        scope.open = false;
                    });
                    $(document).off('click', resetOpen);
                }

                /**
                 * 下拉框点击事件
                 * @param $event
                 */
                scope.selectHandle = function ($event) {
                    //$event.stopPropagation();
                    if (scope.open) {
                        return;
                    }

                    scope.open = !scope.open;
                    $(document).off('click', resetOpen);
                    setTimeout(function () {
                        $(document).on('click', resetOpen);
                    }, 0);
                };

                /**
                 * 项点击事件
                 * @param data
                 * @param $event
                 */
                scope.selectItemHandle = function (data, $event) {
                    $event.stopPropagation();
                    scope.content = data;
                    scope.open = false;
                };

                /**
                 * 项鼠标进入事件
                 * @param $event
                 */
                scope.selectItemEnterHandle = function ($event) {
                    var $target = $($event.target);
                    $target.css('background', '#3180a8');
                };

                /**
                 * 项鼠标离开事件
                 * @param $event
                 */
                scope.selectItemLeaveHandle = function ($event) {
                    var $target = $($event.target);
                    $target.css('background', '#000');
                };
            }
        }
    });
});