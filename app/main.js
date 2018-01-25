require.config({
    waitSeconds: 0,
    paths: {
        "polyfill": "../js/polyfill/polyfill",
        "jquery": "../js/jquery/jquery-1.10.2.min",
        'jqueryui': '../js/jquery/jquery-ui',
        "angular": "../js/angular/angular.min",
        "angular-animate": "../js/angular/angular-animate.min",
        "domReady": "../js/require/domReady",
        "echarts": "../js/echarts/echarts.min",
        "Cesium": "../js/Cesium/Cesium",
        "pubsub": "../js/pubsub.min",
        "gistool":"../js/tools-ext/viewerCesiumNavigationMixin",

        "kendo": "../js/kendo.all.min",
        "three": "../js/three/three",
        "orbitControls": "../js/three/OrbitControls",
        "gltfLoader": "../js/three/GLTFLoader",
        "scene3d": "../js/scene3D",

        "util": "util",
        "app": "app",
        "values": "values",
        "panelManager": "panelManager",
        "bootstrap": "bootstrap",
        "components": "components",
        "controllers": "controllers",
        "models": "models",
        'service': 'service/dataService'
    },
    shim: {
        "angular": {
            deps: ["jquery"],
            exports: 'angular'
        },
        "angular-animate": {
            deps: ["angular"]
        },
        "Cesium": {
            exports: "Cesium"
        },
        "gistool":{
            deps: ["Cesium"],
            exports: 'gistool'
        },
        "kendo": ["jquery", "angular"],
        // "orbitControls": {
        //     deps: ["three"],
        //     exports: "orbitControls"
        // },
        // "gltfLoader": {
        //     deps: ["three"],
        //     exports: "gltfLoader"
        // }
    },
    deps: ["bootstrap"]
});