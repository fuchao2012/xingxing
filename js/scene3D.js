define(['three', 'orbitControls', 'gltfLoader'], function (three) {

    function defaultValue(obj, value) {
        if (!obj) return value;
        else return obj;
    }

    /**
     * 使用Three创建一个3d模型查看的环境
     * @param url
     * @param element
     * @param options
     */
    function Scene3D(url, element, options) {

        if (null == element) {
            throw new Error("dom element不能为空");
        }

        this.options = options;
        this.url = url;
        this.container = element;
        this.containerWidth = element.offsetWidth;
        this.containerHeight = element.offsetHeight;

        this.scene = null;
        this.renderer = null;
        this.laoder = null;
        this.camera = null;
        this.clock = new three.Clock();
        this.orbitControls = null;
        this.gltf = null;
        this.mixer = null;

        this.radius = 100;
        this.theta = 0;

        this.onload();
    }

    Scene3D.prototype.onload = function () {
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.initScene();
        this.animate();
    };

    Scene3D.prototype.initScene = function () {
        this.scene = new three.Scene();
        this.camera = new three.PerspectiveCamera(45, this.containerWidth / this.containerHeight, 1, 200);

        this.scene.add(this.camera);

        var spot1 = null;

        // 灯光
        if (this.options.addLights) {

            var ambient = new three.AmbientLight(0x222222);
            this.scene.add(ambient);

            var directionalLight = new three.DirectionalLight(0xdddddd);
            directionalLight.position.set(0, 0, 1).normalize();
            this.scene.add(directionalLight);

            spot1 = new three.SpotLight(0xffffff, 1);
            spot1.position.set(10, 20, 10);
            spot1.angle = 0.25;
            spot1.distance = 1024;
            spot1.penumbra = 0.75;

            if (this.options.shadows) {
                spot1.castShadow = true;
                spot1.shadow.bias = 0.0001;
                spot1.shadow.mapSize.width = 2048;
                spot1.shadow.mapSize.height = 2048;
            }

            this.scene.add(spot1);
        }

        // RENDERER
        this.renderer = new three.WebGLRenderer({antialias: true});
        this.renderer.setClearColor(0x222222);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.containerWidth, this.containerHeight);

        if (this.options.shadows) {
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = three.PCFSoftShadowMap;
        }

        this.container.appendChild(this.renderer.domElement);

        var ground = null;

        if (this.options.addGround) {
            var groundMaterial = new three.MeshPhongMaterial({
                color: 0xFFFFFF,
                shading: three.SmoothShading
            });
            ground = new three.Mesh(new three.PlaneBufferGeometry(512, 512), groundMaterial);

            if (this.options.shadows) {
                ground.receiveShadow = true;
            }

            if (this.options.groundPos) {
                ground.position.copy(this.options.groundPos);
            } else {
                ground.position.z = -70;
            }

            ground.rotation.x = -Math.PI / 2;

            this.scene.add(ground);
        }

        this.loader = new three.GLTFLoader();
        var instance = this;
        this.loader.load(this.url, function (data) {

            instance.gltf = data;

            var object = instance.gltf.scene;

            if (instance.options.cameraPos)
                instance.camera.position.copy(instance.options.cameraPos);

            if (instance.options.center) {
                instance.orbitControls.target.copy(instance.options.center);
            }

            if (instance.options.objectPosition) {
                object.position.copy(instance.options.objectPosition);

                if (spot1) {
                    spot1.position.set(instance.options.objectPosition.x - 100, instance.options.objectPosition.y + 200, instance.options.objectPosition.z - 100);
                    spot1.target.position.copy(instance.options.objectPosition);
                }
            }

            if (instance.options.objectRotation)
                object.rotation.copy(instance.options.objectRotation);

            if (instance.options.objectScale)
                object.scale.copy(instance.options.objectScale);

            var animations = instance.gltf.animations;

            if (animations && animations.length) {

                instance.mixer = new three.AnimationMixer(object);

                for (var i = 0; i < animations.length; i++) {

                    var animation = animations[i];

                    // There's .3333 seconds junk at the tail of the Monster animation that
                    // keeps it from looping cleanly. Clip it at 3 seconds
                    if (instance.options.animationTime)
                        animation.duration = instance.options.animationTime;

                    instance.mixer.clipAction(animation).play();
                }

            }

            instance.scene.add(object);
            instance.onWindowResize();

        });

        this.orbitControls = new three.OrbitControls(this.camera, this.renderer.domElement);
    };

    Scene3D.prototype.onWindowResize = function () {
        this.camera.aspect = this.containerWidth / this.containerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.containerWidth, this.containerHeight);
    };

    Scene3D.prototype.animate = function () {
        var animate = this.animate.bind(this);
        requestAnimationFrame(animate);
        if (this.mixer) {
            this.mixer.update(this.clock.getDelta());
        }

        // this.theta += 0.5;
        //
        // this.camera.position.x = this.radius * Math.sin( three.Math.degToRad( this.theta ) );
        // this.camera.position.z = this.radius * Math.cos( three.Math.degToRad( this.theta ) );
        // this.camera.lookAt( this.scene.position );

        // this.camera.updateMatrixWorld();
        //
        // this.orbitControls.update();
        this.render();
    };

    Scene3D.prototype.render = function () {
        this.renderer.render(this.scene, this.camera);
    };

    Scene3D.prototype.cleanup = function () {
        if (this.container && this.renderer) {
            this.container.removeChild(this.renderer.domElement);
        }

        if (!this.loader || !this.mixer)
            return;

        this.mixer.stopAllAction();
    };

    return Scene3D;

});