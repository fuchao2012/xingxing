define(['app'], function (app) {
    app.directive('tabTip', function () {
        return {
            restrict: 'A',
            scope: {
                open: '=open'
            },
            template: '<a ng-style="style"></a>',
            replace: true,
            link: function (scope, element, attrs) {

                var getImage = function (open) {
                    if (open) {
                        return 'url(images/up.png)';
                    } else {
                        return 'url(images/down.png)';
                    }
                };
                scope.style = {
                    float: 'right',
                    width: '10px',
                    height: '7px',
                    marginTop: '18px',
                    marginRight: '15px',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    backgroundImage: getImage(scope.open)
                };

                scope.$watch("open", function () {
                    scope.style.backgroundImage = getImage(scope.open);
                });
            }
        }
    });
});