define(['jquery', 'pubsub'], function ($, pubsub) {

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

    function fullScreen(element) {
        element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
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

    var panelManager = {
        cesiumAnimationContainer: {
            open: function () {
                $('.cesium-viewer-animationContainer').animate({left: $('.managePanel').css('width')});
            },
            close: function () {
                $('.cesium-viewer-animationContainer').animate({left: '0px'});
            }
        },

        cesiumTimelineContainer: {
            isOpen: true,
            open: function (callback) {
                $('.cesium-viewer-timelineContainer').animate({left: parseFloat($('.managePanel').css('width')) + 170 + 'px'}, function () {
                    callback && callback()
                });
                this.isOpen = true;
            },
            close: function (callback) {
                $('.cesium-viewer-timelineContainer').animate({left: '170px'}, function () {
                    callback && callback();
                });
                this.isOpen = false;
            }
        },

        cesiumToolbarContainer: {
            open: function () {
                $('.cesium-viewer-toolbar').animate({right: '405px'});
            },
            close: function () {
                $('.cesium-viewer-toolbar').animate({right: '40px'});
            }
        },

        managePanel: {
            open: function () {
                $(".managePanel").animate({left: '0px'});
                $('.managePanelControl').css('background-image', 'url(images/left.png)');
            },
            close: function () {
                $(".managePanel").animate({left: '-' + $(".managePanel").css('width')});
                $('.managePanelControl').css('background-image', 'url(images/right.png)');
            }
        },

        detailPanel: {
            isOpen: false,
            open: function () {
                $(".detailPanel").animate({right: '0px'});
                panelManager.cesiumToolbarContainer.open();
                $('.fullMapContainer').animate({right: '370px'});
                $('.detailPanelControl').css('background-image', 'url(images/right.png)');
                this.isOpen = true;
            },
            close: function () {
                $(".detailPanel").animate({right: '-' + $(".detailPanel").css('width')})
                panelManager.cesiumToolbarContainer.close();
                $('.fullMapContainer').animate({right: '5px'});
                $('.detailPanelControl').css('background-image', 'url(images/left.png)');
                this.isOpen = false;
            }
        },

        propertyPanel: {
            open: function () {
                $(".propertyPanel").animate({left: '0%'});
            },
            close: function () {
                $(".propertyPanel").animate({left: '100%'});
            }
        },

        /**
         * 所有的面板open/close
         */
        allPanel: {
            open: function () {
                panelManager.cesiumAnimationContainer.open();
                panelManager.cesiumTimelineContainer.open();
                panelManager.managePanel.open();
                //避免在没有数据的时候摊开右侧面板
                if ($('.detailPanel .logo').length > 0) {
                    panelManager.detailPanel.open();
                }
                $('.cesium-viewer-animationContainer').animate({bottom: '30px'});
                $('.cesium-viewer-timelineContainer').animate({bottom: '30px'});
                $('.cesium-viewer-toolbar').animate({top: '85px'});
                //panelManager.cesiumToolbarContainer.open();
                $('.fullMapContainer').animate({top: '85px'});
                //$('.fullMapContainer').animate({right: '370px'});
                $('header').slideDown();
                $('footer').slideDown('normal', function () {
                });

                setTimeout(function () {
                    exitFullScreen();
                }, 500);
            },

            close: function () {
                panelManager.cesiumAnimationContainer.close();
                panelManager.cesiumTimelineContainer.close();
                panelManager.managePanel.close();
                panelManager.detailPanel.close();
                $('.cesium-viewer-animationContainer').animate({bottom: '0px'});
                $('.cesium-viewer-timelineContainer').animate({bottom: '0px'});
                //panelManager.cesiumToolbarContainer.close();
                $('.cesium-viewer-toolbar').animate({top: '5px'});
                //$('.fullMapContainer').animate({right: '5px'});
                $('.fullMapContainer').animate({top: '5px'});
                $('header').slideUp();
                $('footer').slideUp('normal', function () {
                });
                setTimeout(function () {
                    fullScreen();
                }, 500);
            }
        }
    };

    window.panelManager = panelManager;

    return panelManager;


});