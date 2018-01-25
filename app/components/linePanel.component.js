define([
    'app',
    'controllers/linePanel.controller',
], function (app, controller) {
    app.component('linePanel', {
        templateUrl: 'app/templates/linePanel.template.html',
        controller: controller
    });
});