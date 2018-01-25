define(['util'], function (util) {
    return ['$scope', 'dataService', function ($scope, dataService) {
        var self = this;
        dataService.getStatisticsData({})
            .then(function (data) {
                util.safeApply($scope, function () {
                    self.organization = util.getValueWithComma(data.organization);
                    self.product = util.getValueWithComma(data.product);
                    self.technology = util.getValueWithComma(data.technology);
                });
            })
    }];
});