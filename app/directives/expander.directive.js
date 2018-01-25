define(['app'], function (app) {
    app.directive('expander', function () {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {

                $element.unbind("click").bind("click", function(){
                    var $content = $element.next();
                    $content.toggle();

                    var $tabTip = $element.find("[tab-tip]");
                    var open = $content.css("display") !== "none";
                    if (open) {
                        $tabTip.css("background-image", "url(images/up.png)");
                    } else {
                        $tabTip.css("background-image", "url(images/down.png)");
                    }
                });
            }
        }
    });
});