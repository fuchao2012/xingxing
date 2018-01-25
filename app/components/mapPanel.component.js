define([
    'app',
    'controllers/mapPanel.controller',
], function (app, controller) {
    app.component('mapPanel', {
        templateUrl: 'app/templates/mapPanel.template.html',
        controller: controller
    });
});