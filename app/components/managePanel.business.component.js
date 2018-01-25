define([
    'app',
    'controllers/managePanel.business.controller'
], function (app, controller) {
    app.component('businessPanel', {
        templateUrl: 'app/templates/managePanel.business.template.html',
        require: {
            managePanel: '^managePanel'
        },
        controller: controller
    });
});