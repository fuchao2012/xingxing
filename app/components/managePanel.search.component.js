define([
    'app',
    'controllers/managePanel.search.controller'
], function (app, controller) {
    app.component('searchPanel', {
        templateUrl: 'app/templates/managePanel.search.template.html',
        require: {
            managePanel: '^managePanel'
        },
        controller: controller
    });
});