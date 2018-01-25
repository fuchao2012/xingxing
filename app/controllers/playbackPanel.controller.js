define(['pubsub', 'util'], function (pubsub, util) {
    return ['$scope', '$interval', 'dataService', 'events', function ($scope, $interval, dataService, events) {
        var self = this;

        $scope.prevShow = true;
        $scope.playShow = true;
        $scope.stopShow = true;
        $scope.nextShow = true;
        $scope.showLineStyle = {
            width: '0%'
        };
        $scope.speed = 1;
        $scope.speedList = [1, 2, 4, 8];

        var interval;
        var nowStep = 0;
        var step = 1;
        var playbackData = null;
        /**
         * 播放状态 1：播放，0：没播放
         * @type {number}
         */
        var playState = 0;

        function play() {
            if (step > 0) {
                interval = $interval(next, 1000 / $scope.speed);
                $scope.playShow = false;
            }
            playState = 1;
        }

        function pause() {
            $interval.cancel(interval);
            $scope.playShow = true;
            playState = 0;
        }

        function stop() {
            $interval.cancel(interval);
            nowStep = 0;
            $scope.playShow = true;
            $scope.showLineStyle.width = getWidth();
            pubsub.publish(events.playbackProgressChanged, playbackData[getDataIndex()]);
            playState = 0;
        }

        function prev() {
            if (nowStep > 0 && step > 0) {
                nowStep -= step;
                $scope.showLineStyle.width = getWidth();
                pubsub.publish(events.playbackProgressChanged, playbackData[getDataIndex()]);
            }
        }

        function next() {
            if (getDataIndex(nowStep + step) >= playbackData.length) {
                $interval.cancel(interval);
            } else {
                nowStep += step;
                $scope.showLineStyle.width = getWidth();
                pubsub.publish(events.playbackProgressChanged, playbackData[getDataIndex()]);
            }
        }

        function slow() {
            var index = $scope.speedList.indexOf($scope.speed);
            if (index > 0) {
                $scope.speed = $scope.speedList[index - 1];
                if (playState) {
                    $interval.cancel(interval);
                    interval = $interval(next, 1000 / $scope.speed);
                }
            }
        }

        function fast() {
            var length = $scope.speedList.length;
            var index = $scope.speedList.indexOf($scope.speed);
            if (index < length - 1) {
                $scope.speed = $scope.speedList[index + 1];
                if (playState) {
                    $interval.cancel(interval);
                    interval = $interval(next, 1000 / $scope.speed);
                }
            }
        }

        function speedSelectChange() {
            $interval.cancel(interval);
            interval = $interval(next, 1000 / $scope.speed);
        }

        $scope.prevButtonMouseUp = prev;
        $scope.nextButtonMouseUp = next;
        $scope.playButtonMouseUp = play;
        $scope.pauseButtonMouseUp = pause;
        $scope.stopButtonMouseUp = stop;
        $scope.slowButtonMouseUp = slow;
        $scope.fastButtonMouseUp = fast;
        $scope.speedSelectChange = speedSelectChange;

        function getWidth() {
            return nowStep + '%';
        }

        function getDataIndex(step) {
            if (step === undefined) {
                step = nowStep;
            }
            var length = playbackData.length;
            return Math.round((length - 1) * step / 100);
        }

        function dataChanged(data) {
            playbackData = data;
            stop();
            if (data && data.length > 0) {
                step = 100 / (data.length - 1);
            } else {
                step = 0;
            }
            nowStep = 0;
            util.safeApply($scope, function () {
                $scope.playShow = true;
            });
        }

        pubsub.subscribe(events.businessSelectionChanged, function (data) {
            dataChanged(data.mapData);
        });

        pubsub.subscribe(events.searchSelectionChanged, function (data) {
            dataChanged(data.mapData);
        });

        dataService.getMapData({})
            .then(function (data) {
                setTimeout(function () {
                    dataChanged(data);
                }, 1000);
            });


    }];
});