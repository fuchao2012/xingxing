define([
    'app',
    'controllers/playbackPanel.controller'
], function (app, controller) {
    app.component('playbackPanel', {
        templateUrl: 'app/templates/playbackPanel.template.html',
        controller: controller
    });
});