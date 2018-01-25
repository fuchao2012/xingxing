define([
    'app',
    'controllers/managePanel.controller',
    './managePanel.search.component',
    './managePanel.business.component',
    './managePanel.battleField.component',
], function (app, controller) {
    app.component('managePanel', {
        templateUrl: 'app/templates/managePanel.template.html',
        controller: controller
    });
});