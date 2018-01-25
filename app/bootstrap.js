define(["require",
    "jquery",
    "angular",
    "polyfill",
    "app",
    "values",
    /*"components/mapPanel.component",
     "components/managePanel.component",
     "components/statisticsPanel.component",
     "components/linePanel.component",
     "components/playbackPanel.component",
     "components/detailPanel.component",
     "controllers/header.controller",
     "directives/tabTip.directive",
     "directives/checkBox.directive",
     "directives/selectList.directive",*/
    "service"
], function (require, $, angular) {
    'use strict';

    require(["components/mapPanel.component",
        "components/managePanel.component",
        //"components/statisticsPanel.component",
        "components/linePanel.component",
        "components/playbackPanel.component",
        "components/detailPanel.component",
        'components/propertyPanel.component',
        "controllers/header.controller",
        "directives/tabTip.directive",
        "directives/checkBox.directive",
        "directives/selectList.directive",
        "directives/expander.directive",
        "directives/tag.directive"
    ], function () {
        angular.bootstrap(document, ['app']);
    });

    //require(['domReady!'], function (document) {
    //angular.bootstrap(document, ['app']);
    //});
});