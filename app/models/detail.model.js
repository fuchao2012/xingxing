define([], function () {

    // /**
    //  * 列表条目对象
    //  * @param value 值
    //  * @param interactive 是否可以交互
    //  * @constructor
    //  */
    // function ListItem(value, interactive, items) {
    //     this.value = value;
    //     this.interactive = interactive;
    //     this.items = null == items ? [] : items;
    // }
    //
    // /**
    //  * 列表对象
    //  * @param name 列表名称
    //  * @constructor
    //  */
    // function List(name) {
    //     this.name = name;
    //     this.items = [];
    // }

    /**
     * 树对象
     * @param name 树名称
     * @constructor
     */
    function Tree(name){
        this.name = name;
        this.items = [];
        this.dataSource = null;
    }

    /**
     * 表格单元格对象
     * @param value 单元格的值
     * @param interactive 是否可以交互
     * @constructor
     */
    function TableCell(value, interactive) {
        this.value = value;
        this.interactive = interactive;
    }

    /**
     * 表格行对象
     * @constructor
     */
    function TableRow() {
        this.cells = [];
    }

    /**
     * 表格对象
     * @param name 表格名称
     * @constructor
     */
    function Table(name) {
        this.name = name;
        this.rows = [];
        this.columns = [];
    }

    /**
     * 饼图对象
     * @constructor
     */
    function Pie() {
        this.legends = [];
        this.values = [];
    }

    /**
     * 线图条目对象
     * @constructor
     */
    function LineItem() {
        this.dimension = "";
        this.values = [];
    }

    /**
     * 线图对象
     * @constructor
     */
    function Line() {
        this.legends = [];
        this.items = [];
    }

    /**
     * 柱图条目对象
     * @constructor
     */
    function BarItem() {
        this.dimension = "";
        this.values = [];
    }

    /**
     * 柱图对象
     * @constructor
     */
    function Bar() {
        this.legends = [];
        this.items = [];
    }

    /**
     * 对象详细信息对象
     * @param name 对象名称
     * @param type 对象类型信息
     * @param desc 对象文字描述
     * @param image 对象图片
     * @param model3D 对象3d模型路径（url）
     * @constructor
     */
    function DetailInfo(name, type, desc, image, model3D) {
        this.name = name;
        this.type = type;
        this.desc = desc;

        this.image = image;
        this.model3D = model3D;

        this._listMembers = [];
        this._tableMembers = [];

        this._videos = [];
        this._audios = [];
        this._files = [];

        //TODO: 图表数据
        this.icon = null;
        this._lineChartData = null;
        this._barChartData = null;
        this._pieChartData = null;
    }

    Object.defineProperties(DetailInfo.prototype, {

        /**
         * 获取列表元素数组
         */
        listMembers: {
            get: function () {
                return this._listMembers;
            }
        },

        /**
         * 获取表格元素数组
         */
        tableMembers: {
            get: function () {
                return this._tableMembers;
            }
        },

        /**
         * 获取视频元素数组
         */
        videos: {
            get: function () {
                return this._videos;
            }
        },

        /**
         * 获取音频元素数组
         */
        audios: {
            get: function () {
                return this._audios;
            }
        },

        /**
         * 获取文件元素数组
         */
        files: {
            get: function () {
                return this._files;
            }
        },

        /**
         * 获取饼图数据
         */
        pieChartData: {
            get: function () {
                return this._pieChartData;
            },
            set: function (value) {
                this._pieChartData = value;
            }
        },

        /**
         * 获取线图数据
         */
        lineChartData: {
            get: function () {
                return this._lineChartData;
            },
            set: function (value) {
                this._lineChartData = value;
            }
        },

        /**
         * 获取柱图数据
         */
        barChartData: {
            get: function () {
                return this._barChartData;
            },
            set: function (value) {
                this._barChartData = value;
            }
        }
    });

    //region -- this --

    var result = {};
    result.Tree = Tree;
    // result.ListItem = ListItem;
    // result.List = List;
    result.TableCell = TableCell;
    result.TableRow = TableRow;
    result.Table = Table;
    result.Pie = Pie;
    result.LineItem = LineItem;
    result.Line = Line;
    result.BarItem = BarItem;
    result.Bar = Bar;
    result.DetailInfo = DetailInfo;

    //endregion

    return result;
});