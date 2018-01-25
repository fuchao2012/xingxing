define(['app', '../controllers/propertyPanel.controller'], function (app, controller) {
    app.component('propertyPanel', {
        templateUrl: 'app/templates/propertyPanel.template.html',
        controller: controller
    });
});