define(['app'], function (app) {

    app.constant('events', {
        'searchChanged': 'searchChanged',
        'searchSelectionChanged': 'searchSelectionChanged',
        'businessSelectionChanged': 'businessSelectionChanged',
        'detailChanged': 'detailChanged',
        'playbackProgressChanged': 'playbackProgressChanged',
        'dialogLineChanged': 'dialogLineChanged',
        'panelChanged': 'panelChanged'
    });

    app.constant('modules', [{
        "name": "信息检索",
        "component": "components/managePanel.search.component",
        "default": false
    }, {
        "name": "业务展示",
        "component": "components/managePanel.business.component",
        "default": true
    },
        {
            "name": "战场态势",
            "component": "components/managePanel.battleField.component",
            "default": false
        }
    ]);

    app.constant('searchCheck', ['机构', '产品', '技术', '信息']);

    app.constant('country', [
        {
            continent: '亚洲',
            countries: [
                '中国',
                '日本',
                '印度'
            ]
        },
        {
            continent: '欧洲',
            countries: [
                '英国',
                '德国',
                '意大利',
                '法国',
                '俄罗斯'
            ]
        },
        {
            continent: '美洲',
            countries: [
                '美国',
                '加拿大',
                '巴西'
            ]
        },
        {
            continent: '非洲',
            countries: [
                '埃及',
                '南非'
            ]
        },
        {
            continent: '澳洲',
            countries: [
                '澳大利亚',
                '新西兰'
            ]
        }]);

    app.constant('colors', ['#4DD2FF', '#FFC926', '#DDDDDD', '#7D9DB5', '#50738D', '#A0C021', '#2D9D76', '#006666', '#0085B2', '#6371CF']);
});