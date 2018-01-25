define([], function () {

    /**
     * 搜索数据
     * @constructor
     */
    var SearchData = function () {
        /**
         * 数据类型
         * @type {undefined}
         */
        this.type = undefined;
        /**
         * 名称
         * @type {string}
         */
        this.name = '';
        /**
         * 信息
         * @type {string}
         */
        this.information = '';
    };

    /**
     * 搜索参数累
     * @constructor
     */
    var SearchParam = function () {
        this.keyword = '';
        this.types = [];
        /**
         * 是否启用高级搜索
         * @type {boolean}
         */
        this.advancedSearch = false;
        this.countries = [];
        this.filed = '';
        this.organization = '';
        this.type = '';
    };

    return {
        SearchData: SearchData,
        SearchParam: SearchParam
    };
});