define([], function () {

    /**
     * 表示Kendo Treeview的实体
     * @param data 数据的实体
     * @param text treeviewItem显示的名称
     * @param parent 当前Item的父级Item
     * @param children 子级Item
     * @constructor
     */
    function TreeViewItem(data, text, children) {
        this.id = TreeViewItem.id++;
        this.text = text;
        this.data = data;
        // this.checked = true;
        this.expanded = true;
        this.items = children ? children : [];
    }

    TreeViewItem.id = 0;

    Object.defineProperties(TreeViewItem.prototype, {
        /**
         * 当前Item的子级Items
         */
        Items: {
            get: function () {
                return this.items;
            }
        },

        HasChildren: {
            get: function () {
                return this.items ? this.items.length > 0 : false;
            }
        },

        /**
         * 在treeview中的唯一标识，该ID在生成时递增指定
         */
        Id: {
            get: function () {
                return this.id;
            }
        },

        /**
         * 数据实体
         */
        Data: {
            get: function () {
                return this.data;
            }
        },

        /**
         * treeviewItem显示的名称
         */
        Text: {
            get: function () {
                return this.text;
            }
        },

        /**
         * 是否已经选中
         */
        Checked: {
            get: function () {
                return this.checked;
            }
        }
    });

    function CheckEventArgs(source, data) {
        this._source = source;
        this._data = data;
    }

    Object.defineProperties(CheckEventArgs.prototype, {

        source: {
            get: function () {
                return this._source;
            }
        },

        data: {
            get: function () {
                return this._data;
            }
        }

    });

    function SelectEventArgs(source, data) {
        this._source = source;
        this._data = data;
    }

    Object.defineProperties(SelectEventArgs.prototype, {

        source: {
            get: function () {
                return this._source;
            }
        },

        data: {
            get: function () {
                return this._data;
            }
        }

    });

    return {
        TreeViewItem: TreeViewItem,
        CheckEventArgs: CheckEventArgs,
        SelectEventArgs: SelectEventArgs
    };
});