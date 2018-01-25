define([], function () {

    /**
     * 线图的属性
     * @constructor
     */
    var LineProperty = function () {
        this.name = '';
        this.value = '';

    };

    /**
     * 线图
     * @constructor
     */
    var Line = function () {
        this.time = '';
        this.properties = [];
    };

    return {
        LineProperty: LineProperty,
        Line: Line
    }
});