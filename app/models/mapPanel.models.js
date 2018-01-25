define([], function () {

    /**
     * 机构
     * @constructor
     */
    var Organization = function () {
        this.name = '';
        this.longitude = '';
        this.latitude = '';
        this.id = '';
        this.correlation = [];
    };

    /**
     * 产品
     * @constructor
     */
    var Product = function () {
        this.name = '';
        this.longitude = '';
        this.latitude = '';
        this.id = '';
        this.correlation = [];
    };

    /**
     * 技术
     * @constructor
     */
    var Technology = function () {
        this.name = '';
        this.longitude = '';
        this.latitude = '';
        this.id = '';
        this.correlation = [];
    };

    /**
     * 地图数据结构类
     * @constructor
     */
    var MapData = function () {

        /**
         * 时间
         * @type {Date}
         */
        this.time = undefined;

        /**
         * 机构列表
         * @type {Array}
         */
        this.organizations = [];

        /**
         * 产品列表
         * @type {Array}
         */
        this.products = [];

        /**
         * 技术列表
         * @type {Array}
         */
        this.technologies = [];
    };

    return {
        Organization: Organization,
        Product: Product,
        Technology: Technology,
        MapData: MapData
    }
});