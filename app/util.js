define([], function () {

    var util = {
        /**
         * 安全Apply
         * @param $scope scope对象
         * @param fn 执行函数
         */
        safeApply: function ($scope, fn) {
            var phase = $scope.$root.$$phase;
            if (phase === '$apply' || phase == '$digest') {
                if (fn && typeof fn == 'function') {
                    fn();
                }
            } else {
                $scope.$apply(fn);
            }
        },

        /**
         * 转换数值为千字符
         * @param value
         * @returns {*}
         */
        getValueWithComma: function (value) {
            //非数字处理
            if (+value !== +value) {
                return '';
            }

            value += "";

            //处理数值的小树部分
            var leftValue = value.split('.')[0],
                rightValue = value.split('.')[1];

            for (var i = leftValue.length - 3; i > 0; i -= 3) {
                var char = leftValue.charAt(i);
                if (char !== "") {
                    leftValue = leftValue.substring(0, i) + ',' + leftValue.substring(i);
                }
            }

            var result = leftValue;
            if (rightValue !== undefined) {
                result += '.' + rightValue;
            }
            return result;
        },

        /**
         * 深拷贝
         * @param src
         * @returns {{}}
         */
        clone: function (src) {
            var clone = {};
            for (var name in src) {
                if (src.hasOwnProperty(name)) {
                    if (Array.isArray(src[name])) {
                        clone[name] = src[name].slice();
                    } else if (typeof src[name] == 'object') {
                        clone[name] = util.clone(src[name]);
                    }
                    else {
                        clone[name] = src[name];
                    }
                }
            }
            return clone;
        }
    };

    return util;
});