define(['app','../controllers/statisticsPanel.controller'], function (app, controller) {
    app.component('statisticsPanel', {
        templateUrl: 'app/templates/statisticsPanel.template.html',
        controller: controller
    });
});