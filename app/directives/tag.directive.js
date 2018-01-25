define(['app'], function (app) {
    app.directive('tag', function () {
        return {
            restrict: 'A',
            link: function ($scope, $element, attrs) {
                $scope.$watch(attrs.tag, function (value) {
                    $element.data(value);
                });
            }
        }
    });
});