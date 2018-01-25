define(['require', 'jquery', 'pubsub', 'util', 'panelManager','gistool'], function (require, $, pubsub, util, panelManager,gistool) {
    var CesiumHelper = (function () {
        var Cesium;
        var viewer;

        var imageMap = {
            organization: './images/organization.png',
            product: './images/product.png',
            technology: './images/technology.png'
        };

        function getLinkedPointList(startPoint, endPoint, angularityFactor, numOfSingleLine) {
            var result = [];


            var startPosition = Cesium.Cartographic.fromCartesian(startPoint);
            var endPosition = Cesium.Cartographic.fromCartesian(endPoint);

            var startLon = startPosition.longitude * 180 / Math.PI;
            var startLat = startPosition.latitude * 180 / Math.PI;
            var endLon = endPosition.longitude * 180 / Math.PI;
            var endLat = endPosition.latitude * 180 / Math.PI;

            var dist = Math.sqrt((startLon - endLon) * (startLon - endLon) + (startLat - endLat) * (startLat - endLat));


            //var dist = Cesium.Cartesian3.distance(startPoint, endPoint);
            var angularity = dist * angularityFactor;

            var startVec = Cesium.Cartesian3.clone(startPoint);
            var endVec = Cesium.Cartesian3.clone(endPoint);

            var startLength = Cesium.Cartesian3.distance(startVec, Cesium.Cartesian3.ZERO);
            var endLength = Cesium.Cartesian3.distance(endVec, Cesium.Cartesian3.ZERO);

            Cesium.Cartesian3.normalize(startVec, startVec);
            Cesium.Cartesian3.normalize(endVec, endVec);

            if (Cesium.Cartesian3.distance(startVec, endVec) == 0) {
                return result;
            }

            //var cosOmega = Cesium.Cartesian3.dot(startVec, endVec);
            //var omega = Math.acos(cosOmega);

            var omega = Cesium.Cartesian3.angleBetween(startVec, endVec);

            result.push(startPoint);
            for (var i = 1; i < numOfSingleLine - 1; i++) {
                var t = i * 1.0 / (numOfSingleLine - 1);
                var invT = 1 - t;

                var startScalar = Math.sin(invT * omega) / Math.sin(omega);
                var endScalar = Math.sin(t * omega) / Math.sin(omega);

                var startScalarVec = Cesium.Cartesian3.multiplyByScalar(startVec, startScalar, new Cesium.Cartesian3());
                var endScalarVec = Cesium.Cartesian3.multiplyByScalar(endVec, endScalar, new Cesium.Cartesian3());

                var centerVec = Cesium.Cartesian3.add(startScalarVec, endScalarVec, new Cesium.Cartesian3());

                var ht = t * Math.PI;
                var centerLength = startLength * invT + endLength * t + Math.sin(ht) * angularity;
                centerVec = Cesium.Cartesian3.multiplyByScalar(centerVec, centerLength, centerVec);

                result.push(centerVec);
            }

            result.push(endPoint);

            return result;
        }

        var originDatas = null;
        var index = 0;
        var lastIndex = undefined;

        var getDataIndex = function (time) {
            var result;
            if (originDatas) {
                for (var i = 0, len = originDatas.length; i < len - 1; i++) {
                    if (time - originDatas[i].time > 0 && time - originDatas[i + 1].time < 0) {
                        if (lastIndex != i) {
                            result = index = lastIndex = i;
                        }
                        break;
                    }
                }
                //判断最后一个节点
                if (originDatas[originDatas.length - 1].time - time < 0) {
                    result = index;
                    lastIndex = index;
                }
                return result;
            }
        };

        var initialize = function (c, v) {
            Cesium = c;
            viewer = v;
            console.log("initlines initialize。。。。。star")
            viewer.clock.onTick.addEventListener(function (clock) {
                if (originDatas != null) {
                    setTimeout(function () {
                        var index = getDataIndex(Cesium.JulianDate.toDate(clock.currentTime));
                        if (index !== undefined) {
                            update(originDatas[index]);
                        }
                    }, 0);

                    /*if (originDatas[index] && Cesium.JulianDate.greaterThan(clock.currentTime, Cesium.JulianDate.fromDate(originDatas[index].time))) {
                     //不放到timeout里就会一闪一闪，why？
                     (function (index) {
                     setTimeout(function () {
                     update(originDatas[index]);
                     }, 0);
                     })(index);
                     index++;
                     }*/
                }
            });
        };

        var initializeCallback = function (callback) {
            pubsub.subscribe('cesiumInitialize', function () {
                callback();
            });
        };

        var Point = function (longitude, latitude, type) {
            this.longitude = longitude;
            this.latitude = latitude;
            this.type = type;

            var image = imageMap[type];
            if (image) {
                viewer.entities.add({
                    position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
                    billboard: {
                        image: image,
                        scaleByDistance: new Cesium.NearFarScalar(1e6, 1, 1e8, 0.2)
                    },
                    ellipse: {
                        material: Cesium.Color.fromCssColorString('#4DD2FF').withAlpha(0.3),
                        semiMajorAxis: new Cesium.CallbackProperty(function (time) {
                            return Math.abs(500000 * Math.sin(time.secondsOfDay));
                        }, false),
                        semiMinorAxis: new Cesium.CallbackProperty(function (time) {
                            return Math.abs(500000 * Math.sin(time.secondsOfDay));
                        }, false)
                    }
                });
            }
        };

        var Line = function (start, end, options) {
            this.start = start;
            this.end = end;

            options = options || {};
            var color = options.color || "#2693FF";
            this.color = color;
            var width = options.widht || 1;
            this.width = width;

            viewer.entities.add({
                polyline: {
                    positions: Cesium.Cartesian3.fromDegreesArray([start.longitude, start.latitude, end.longitude, end.latitude]),
                    width: width,
                    material: Cesium.Color.fromCssColorString(this.color)
                }
            });
        };

        var Link = function (start, end) {
            this.start = start;
            this.end = end;

            var startPoint = Cesium.Cartesian3.fromDegrees(start.longitude, start.latitude);
            var endPoint = Cesium.Cartesian3.fromDegrees(end.longitude, end.latitude);
            var positions = getLinkedPointList(startPoint, endPoint, 30000, 50);

            this.instance = new Cesium.GeometryInstance({
                geometry: new Cesium.PolylineGeometry({
                    positions: positions,
                    width: 7.0,
                    vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT
                })
            });
        };

        var linkHelper = {
            links: [],
            primitive: undefined,
            source: [
                'czm_material czm_getMaterial(czm_materialInput materialInput)',
                '{',
                'czm_material material = czm_getDefaultMaterial(materialInput);',
                'material.diffuse = color.rgb+0.5;',
                'material.alpha = 0.5*texture2D(image,vec2(1.0-fract(time-materialInput.st.s),materialInput.st.t)).a*color.a;',
                /*'material.alpha = texture2D(image,materialInput.st).a;',
                 'material.alpha = 1.0;',*/
                'if(time < 0.2){',
                'material.alpha = 0.0;',
                '}',
                'return material;',
                '}'
            ].join('\n'),
            time: undefined,
            initialize: (function () {
                pubsub.subscribe('cesiumInitialize', function () {
                    viewer.clock.onTick.addEventListener(function (clock) {
                        if (linkHelper.primitive) {
                            var time = Math.abs(Cesium.JulianDate.secondsDifference(clock.currentTime, linkHelper.time));
                            // linkHelper.primitive.appearance.material.uniforms.time = clock.currentTime.secondsOfDay ;
                            linkHelper.primitive.appearance.material.uniforms.time = time;
                        }
                    });
                });
            })(),
            add: function (start, end, options) {
                var link = new Link(start, end, options);
                this.links.push(link);
            },

            draw: function () {
                var self = this;
                this.time = viewer.clock.currentTime;
                var geometryInstances = this.links.map(function (link) {
                    return link.instance;
                });
                this.primitive = viewer.scene.primitives.add(new Cesium.Primitive({
                    asynchronous: false,
                    geometryInstances: geometryInstances,
                    appearance: new Cesium.PolylineMaterialAppearance({
                        material: new Cesium.Material({
                            fabric: {
                                uniforms: {
                                    //color: Cesium.Color.fromCssColorString('rgba(38,147,255,0.8)'),
                                    //color: Cesium.Color.fromCssColorString('rgba(122,147,255,0.95)'),
                                    color: Cesium.Color.fromCssColorString('rgba(77,210,255,0.95)'),
                                    //image: 'images/ArrowOpacity.png',
                                    //image: 'images/ArrowTransparent.png',
                                    image: 'images/DotTransparent.png',
                                    time: 0
                                },
                                source: this.source
                            }
                        }),
                        renderState: {
                            blending: Cesium.BlendingState.ADDITIVE_BLEND
                        }
                    })
                }));
            },

            remove: function () {
                this.links.length = 0;
                if (this.primitive) {
                    viewer.scene.primitives.remove(this.primitive);
                }
            }
        };

        var entities = {
            organization: {},
            product: {}
        };

        var getKey = function (data) {
            return data.id;
        };

        var drawEntity = function (data, type) {
            var key = getKey(data);
            if (!entities[type][key]) {
                var point = new Point(data.longitude, data.latitude, type);
                entities[type][key] = point;
            }

            if (data.correlation && data.correlation.length > 0) {
                data.correlation.forEach(function (e) {
                    var cPoint = drawEntity(e, type);
                    linkHelper.add(point, cPoint);
                })
            }
            return entities[type][key];
        };

        var update = function (data) {
            console.log("map lines update.....");
            if (!viewer) {
                initializeCallback(update.bind(null, data));
                return;
            }
            viewer.entities.removeAll();
            linkHelper.remove();
            entities = {
                organization: {},
                product: {}
            };
            data.organizations.forEach(function (e) {
                drawEntity(e, 'organization');
            });

            data.products.forEach(function (e) {
                drawEntity(e, 'product');
            });

            data.technologies.forEach(function (e) {
                drawEntity(e, 'technology');
            });
            linkHelper.draw();
        };

        var dataChanged = function (data) {
            if (!viewer) {
                initializeCallback(dataChanged.bind(null, data));
                return;
            }

            //设置时间，判断有没有时间
            if (data.length > 0) {
                viewer.clock.startTime = Cesium.JulianDate.fromDate(new Date(data[0].time.getTime()), new Cesium.JulianDate());
                viewer.clock.currentTime = viewer.clock.startTime;
                viewer.clock.stopTime = Cesium.JulianDate.fromDate(new Date(data[data.length - 1].time.getTime()), new Cesium.JulianDate());
                viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
                viewer.timeline.zoomTo(viewer.clock.startTime, viewer.clock.stopTime);
            }

            originDatas = data;
            index = 0;
        };

        return {
            initialize: initialize,
            Point: Point,
            Line: Line,
         // update: update,
            dataChanged: dataChanged
        }
    })();

    return ['$scope', 'dataService', 'events', function ($scope, dataService, events) {
        var self = this;

        require(['Cesium'], function (Cesium) {

            Cesium.Camera.DEFAULT_VIEW_RECTANGLE = new Cesium.Rectangle(
                Cesium.Math.toRadians(110),
                Cesium.Math.toRadians(60),
                Cesium.Math.toRadians(120),
                Cesium.Math.toRadians(10)
            );

            var cacheJulianDate = new Cesium.JulianDate();

            function twoDigits(num) {
                return ((num < 10) ? ('0' + num.toString()) : num.toString());
            }

            /**
             * 修改默认的时间显示格式
             * @param time
             * @returns {string}
             */
            Cesium.Timeline.prototype.makeLabel = function (time) {
                var dateZone8 = Cesium.JulianDate.addHours(time, 8, cacheJulianDate);
                var gregorian = Cesium.JulianDate.toGregorianDate(dateZone8);
                var millisecond = gregorian.millisecond, millisecondString = ' GMT+8';
                if ((millisecond > 0) && (this._timeBarSecondsSpan < 3600)) {
                    millisecondString = Math.floor(millisecond).toString();
                    while (millisecondString.length < 3) {
                        millisecondString = '0' + millisecondString;
                    }
                    millisecondString = '.' + millisecondString;
                }

                return gregorian.year + '/' + gregorian.month + '/' + gregorian.day + ' ' + twoDigits(gregorian.hour) +
                    ':' + twoDigits(gregorian.minute) + ':' + twoDigits(gregorian.second);
            };

            /**
             * 修改默认的时间轴resize事件，主要用于控制其位置
             */
            Cesium.Timeline.prototype.resize = function () {
                var width = this.container.clientWidth;
                var height = this.container.clientHeight;

                if (panelManager.cesiumTimelineContainer.isOpen) {
                    $('.cesium-viewer-timelineContainer').css('left', parseFloat($('.managePanel').css('width')) + 170 + 'px');
                } else {
                    $('.cesium-viewer-timelineContainer').css('left', 170 + 'px');
                }

                if (width === this._lastWidth && height === this._lastHeight) {
                    return;
                }

                this._trackContainer.style.height = height + 'px';

                var trackListHeight = 1;
                this._trackList.forEach(function (track) {
                    trackListHeight += track.height;
                });
                this._trackListEle.style.height = trackListHeight.toString() + 'px';
                this._trackListEle.width = this._trackListEle.clientWidth;
                this._trackListEle.height = trackListHeight;
                this._makeTics();

                this._lastXPos = undefined;
                this._lastWidth = width;
                this._lastHeight = height;
            };

            var viewer = new Cesium.Viewer('mapContainer', {
                //animation: false,
                //timeline: false,
                fullscreenButton: false,
                vrButton: false,
                geocoder: false,
                //homeButton: false,
                infoBox: false,
                // sceneModePicker: false,
                selectionIndicator: false,
                navigationHelpButton: false,
                /* imageryProvider: Cesium.createTileMapServiceImageryProvider({
                 //url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
                 url: './map'
                 }),*/
                //baseLayerPicker: false,
                //selectedImageryProviderViewModel:customImageryProvider,
                skyBox: new Cesium.SkyBox({
                    sources: {
                        positiveX: 'images/skybox/Version2_dark_px.jpg',
                        negativeX: 'images/skybox/Version2_dark_mx.jpg',
                        positiveY: 'images/skybox/Version2_dark_py.jpg',
                        negativeY: 'images/skybox/Version2_dark_my.jpg',
                        positiveZ: 'images/skybox/Version2_dark_pz.jpg',
                        negativeZ: 'images/skybox/Version2_dark_mz.jpg'
                    }
                })
            });
            var options = {
                defaultResetView:Cesium.Rectangle.fromDegrees(110, 60, 120, 10),
                enableCompass:true,
                enableZoomControls:true,
                enableDistanceLegend:true,
                enableCompassOuterRing:true
            };
            viewer.extend(Cesium.viewerCesiumNavigationMixin, options);

            window.viewer = viewer;
            var providerViewModels = [],providerTerrainViewModels=[]; 
            var customImageryProvider = new Cesium.ProviderViewModel({
                name: 'Custom',
                iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/naturalEarthII.png'),
                tooltip: 'Custom Layer',
                creationFunction: function () {
                    return Cesium.createTileMapServiceImageryProvider({
                        url: './map'
                    });
                }
            });
            providerViewModels.push(customImageryProvider);

            //加载离线Bing
            var bingImageryProvider = new Cesium.ProviderViewModel({
                name: 'Bing',
                iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/naturalEarthII.png'),
                tooltip: 'Bing',
                creationFunction: function () {
                    return Cesium.createTileMapServiceImageryProvider({
                        url: 'http://10.1.4.122/bing/tiles'
                    });
                }
            });
            providerViewModels.push(bingImageryProvider);


            
            //加载离线谷歌
            var googleImageryProvider = new Cesium.ProviderViewModel({
                name: 'Google',
                iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/naturalEarthII.png'),
                tooltip: 'Google',
                creationFunction: function () {

                    return new Cesium.UrlTemplateImageryProvider({
                        url: 'http://10.1.4.122/tdt/tiles/{x}/{y}/{z}.png'
                    })
                    // return new Cesium.createTileMapServiceImageryProvider({
                    //     url: 'http://10.1.4.122/tdt/tiles'
                    // });
                }
            });
         // providerViewModels.push(googleImageryProvider);
            //加载arcgis 灰色图
            var arcgisImageryProvider = new Cesium.ProviderViewModel({
                name: 'geo灰',
                iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/naturalEarthII.png'),
                tooltip: 'geo灰',
                creationFunction: function () {
                    return Cesium.createTileMapServiceImageryProvider({
                        url: 'http://10.1.4.122/arcgis/tiles/',
                        tilingScheme:new Cesium.GeographicTilingScheme(),
                        fileExtension: 'png',
                        maximumLevel: 4,
                        rectangle: new Cesium.Rectangle(
                            Cesium.Math.toRadians(-180.0),
                            Cesium.Math.toRadians(-90.0),
                            Cesium.Math.toRadians(180.0),
                            Cesium.Math.toRadians(90.0))
                    });
                }
            });
            providerViewModels.push(arcgisImageryProvider);



        
            viewer.baseLayerPicker.viewModel.imageryProviderViewModels=providerViewModels;
            viewer.baseLayerPicker.viewModel.selectedImagery = customImageryProvider;

            viewer.baseLayerPicker.viewModel.terrainProviderViewModels=[];

            viewer.animation.viewModel.dateFormatter = function (date, viewModel) {
                var gregorianDate = Cesium.JulianDate.toGregorianDate(date);
                return gregorianDate.year + '/' + gregorianDate.month + '/' + gregorianDate.day;
            };

            /**
             * 修改默认的时间格式
             * @param date
             * @param viewModel
             * @returns {*}
             */
            viewer.animation.viewModel.timeFormatter = function (date, viewModel) {
                var dateZone8 = Cesium.JulianDate.addHours(date, 8, cacheJulianDate);
                var gregorianDate = Cesium.JulianDate.toGregorianDate(dateZone8);
                if (Math.abs(viewModel._clockViewModel.multiplier) < 1) {
                    var millisecond = Math.round(gregorianDate.millisecond);
                    return Cesium.sprintf("%02d:%02d:%02d.%03d", gregorianDate.hour, gregorianDate.minute, gregorianDate.second, millisecond);
                }
                return Cesium.sprintf("%02d:%02d:%02d", gregorianDate.hour, gregorianDate.minute, gregorianDate.second);
            };

            CesiumHelper.initialize(Cesium, viewer);
            viewer.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(116.0, 40.0, 10000000)
            });

            pubsub.publish('cesiumInitialize', {
                Cesium: Cesium,
                viewer: viewer
            });

            //初始化时间轴的left值
            setTimeout(function () {
                var left = parseFloat($('.managePanel').css('width')) + 170 + 'px';
                $('.cesium-viewer-timelineContainer').css('left', left);
                $('.cesium-viewer-timelineContainer').css('visibility', 'visible');
            }, 100);

            /**
             * 监听业务展示面板点击事件
             */
            pubsub.subscribe(events.businessSelectionChanged, function (data) {
                console.log(data,"map.......");
                CesiumHelper.dataChanged(data.mapData);
            });

            /**
             * 监听搜索面板点击事件
             */
            pubsub.subscribe(events.searchSelectionChanged, function (data) {
                CesiumHelper.dataChanged(data.mapData);
            });

            /**
             * 监听面板改变事件
             */
            pubsub.subscribe(events.panelChanged, function (panel) {
                if (panel.name == 'managePanel') {
                    if (panel.open) {
                        panelManager.cesiumAnimationContainer.open();
                        panelManager.cesiumTimelineContainer.open(function () {
                            viewer.timeline.resize();
                        });
                    } else {
                        panelManager.cesiumAnimationContainer.close();
                        panelManager.cesiumTimelineContainer.close(function () {
                            viewer.timeline.resize();
                        });
                    }
                }
            });
        });

        /**
         * 获取全屏按钮图片
         * @param isFull
         * @returns {*}
         */
        var getFullMapImage = function (isFull) {
            if (isFull) {
                return 'url(images/closeMap.png)'
            } else {
                return 'url(images/fullMap.png)';
            }
        };

        var isFull = false;

        /**
         * 点击全屏事件
         */
        this.fullMapHandle = function () {
            if (!isFull) {
                panelManager.allPanel.close();
            } else {
                panelManager.allPanel.open();
            }
            isFull = !isFull;

            $('.fullMapContainer').css('backgroundImage', getFullMapImage(isFull));
        };
    }];
});