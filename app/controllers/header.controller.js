define(['app'], function (app) {

    app.controller('headerController', ['$scope', '$interval', function($scope, $interval){

        //region -- Field --

        //endregion

        //region -- Private --

        function fullScreen() {
            var el = document.documentElement,
                rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen,
                wscript;

            if (typeof rfs != "undefined" && rfs) {
                rfs.call(el);
                return;
            }

            if (typeof window.ActiveXObject != "undefined") {
                wscript = new ActiveXObject("WScript.Shell");
                if (wscript) {
                    wscript.SendKeys("{F11}");
                }
            }
        }

        function exitFullScreen() {
            var el = document,
                cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen,
                wscript;

            if (typeof cfs != "undefined" && cfs) {
                cfs.call(el);
                return;
            }

            if (typeof window.ActiveXObject != "undefined") {
                wscript = new ActiveXObject("WScript.Shell");
                if (wscript != null) {
                    wscript.SendKeys("{F11}");
                }
            }
        }

        //endregion

        //region -- Datetime --

        function formatFromTime(time, format) {
            format = format || "yyyy-MM-dd hh:mm:ss";
            var o = {
                "M+": time.getMonth() + 1,
                "d+": time.getDate(),
                "h+": time.getHours(),
                "m+": time.getMinutes(),
                "s+": time.getSeconds(),
                "q+": Math.floor((time.getMonth() + 3) / 3),
                "S": time.getMilliseconds()
            };
            if (/(y+)/.test(format))
                format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(format))
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            return format;
        }

        function formatToTime(str, format) {
            format = format || "yyyy-MM-dd hh:mm:ss";
            var re = /-?\d+/;
            var m = re.exec(str);
            if (m == null) {
                return;
            }
            var d = new Date(parseInt(m[0]));
            return formatFromTime(d, format);
        }

        function getTime() {
            var time = new Date();
            var timeString = formatFromTime(time, "yyyy/MM/dd hh:mm:ss").split(' ');
            $scope.date = timeString[0];
            $scope.time = timeString[1];

            var week = time.getDay();
            switch (week) {
                case 1:
                    week = '星期一';
                    break;
                case 2:
                    week = '星期二';
                    break;
                case 3:
                    week = '星期三';
                    break;
                case 4:
                    week = '星期四';
                    break;
                case 5:
                    week = '星期五';
                    break;
                case 6:
                    week = '星期六';
                    break;
                case 0:
                    week = '星期日';
                    break;
            }
            $scope.week = week;
        }

        getTime();
        $interval(getTime, 1000);

        //endregion

        $scope.appName = "科技资源大数据展示系统";
        $scope.appEnName = "Big Data Display System of Science and Technology Resource";
        $scope.user = "admin";
        $scope.role = "管理员";
        $scope.isFullscreen = false;

        $scope.toggleFullScreen = function(){
            if ($scope.isFullscreen) {
                exitFullScreen()
            } else {
                fullScreen();
            }
            $scope.isFullscreen = !$scope.isFullscreen;
        };
    }]);

});