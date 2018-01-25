/**
 * Created by xupeng on 2017/12/5.
 */
define([
    'app',
    'controllers/managePanel.battleField.controller'
], function (app, controller) {
    app.component('battleField', {
        templateUrl: 'app/templates/managePanel.battleField.template.html',
        require: {
            managePanel: '^managePanel'
        },
        controller: controller
    });
});