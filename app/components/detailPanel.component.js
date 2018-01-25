define([
    'app',
    'controllers/detail.controller',
], function (app, controller) {
    app.component('detailPanel', {
        templateUrl: 'app/templates/detailPanel.template.html',
        controller: controller
    });
});