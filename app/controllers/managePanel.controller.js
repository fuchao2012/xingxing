define(['jquery', 'pubsub', 'panelManager', 'util'], function ($, pubsub, panelManager, util) {
    return ['$scope', '$compile', 'modules', 'events', function ($scope, $compile, modules, events) {

        //region -- Fields

        var self = this;

        //endregion

        //region -- Private --

        function selectModule(module) {
            for(var i = 0; i < modules.length; i++){
                var m = modules[i];
                if(m !== module){
                    m.selected = false;
                }
            }

            module.selected = true;
            $scope.selectedModule = module;
        }

        //endregion

        $scope.selectedModule = null;
        $scope.modules = modules;

        $scope.tab = function ($event, selectedModule) {
            selectModule(selectedModule, $event.currentTarget);
        };

        this.panelControlHandle = function () {
            var open;
            var $panel = $(".managePanel");
            if ($panel.css('left') == '0px') {
                panelManager.managePanel.close();
                open = false;
            } else {
                panelManager.managePanel.open();
                open = true;
            }

            pubsub.publish(events.panelChanged, {
                name: 'managePanel',
                open: open
            });
        };

        this.$onInit = function () {

            if (null != modules) {
                var defaultModule = null;
                var components = [];

                var length = modules.length;
                for (var i = 0; i < length; i++) {
                    var m = modules[i];
                    m["selected"] = false;
                    if (null == defaultModule && m.default) {
                        defaultModule = m;
                    }

                    components.push(modules[i].component);
                }

                if (null == defaultModule) {
                    defaultModule = modules[0];
                    defaultModule.selected = true;
                }

                selectModule(defaultModule);
            }
        };
    }];
});