define(['app'], function (app) {
    app.directive('checkBox', function () {
        return {
            restrict: 'A',
            scope: {
                checked: '=checked'
            },
            template: '<div class="clearfix">' +
            '<a class="left" ng-style="checkboxStyle" ng-click="clickCheckBoxHandle()"></a>' +
            '<div class="left" ng-style="transcludeStyle" ng-click="clickCheckBoxHandle()" ng-transclude></div>' +
            '</div>',
            replace: true,
            transclude: true,
            link: function (scope, element, attrs) {
                scope.checkboxStyle = {
                    position: 'relative',
                    width: '14px',
                    height: '14px',
                    border: '1px solid #2693FF',
                    marginRight: '6px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    cursor: 'pointer'
                };

                scope.transcludeStyle = {
                    cursor: 'pointer',
                    height: '100%'
                };

                scope.clickCheckBoxHandle = function () {
                    scope.checked = !scope.checked;
                };

                scope.$watch("checked", function () {
                    if (scope.checked) {
                        scope.checkboxStyle.backgroundImage = 'url(images/checked.png)';
                    } else {
                        scope.checkboxStyle.backgroundImage = undefined;
                    }
                });

            }
        }
    });
});