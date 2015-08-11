(function () {
    'use strict';

    angular
        .module('app.layout')
        .controller('Shell', Shell);

    Shell.$inject = ['$rootScope', 'config', 'logger', 'dataservice'];

    function Shell($rootScope, config, logger, dataservice) {
        /*jshint validthis: true */
        var vm = this;

        vm.title = config.appTitle;
        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.showSplash = true;

        $rootScope.safeApply = function(fn) {
            var phase = this.$root.$$phase;
            if(phase == '$apply' || phase == '$digest') {
                if(fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };

        activate();

        function activate() {
            logger.success(config.appTitle + ' loaded!', null);
            var stage = activateScene();
            dataservice.ready().then(function () {
                var commands = [];
                commands = {
                    'поехали': function() {
                        // create a background..
                        var background = PIXI.Sprite.fromImage("content/images/bar.png");

                        // add background to stage..
                        stage.addChild(background);
                    },
                    'выход': function() {
                        // create a background..
                        var background = PIXI.Sprite.fromImage("content/images/splash-screen.png");

                        // add background to stage..
                        stage.addChild(background);
                    }
                };
                // Add our commands to annyang
                annyang.addCommands(commands);
                // Start listening.
                annyang.debug(true);
                annyang.setLanguage("ru");
                annyang.start();
            });
        }

        function activateScene() {

            window.addEventListener('orientationchange', function ()
            {
                if (window.innerHeight > window.innerWidth)
                {
                    document.getElementsByTagName('body').style.transform = "rotate(90deg)";
                }
            });

            // create an new instance of a pixi stage
            // the second parameter is interactivity...
            var interactive = true;
            var stage = new PIXI.Stage(0x000000, interactive);

            // create a background..
            var background = PIXI.Sprite.fromImage("content/images/splash-screen.png");

            // add background to stage..
            stage.addChild(background);

            // create a renderer instance.
            var renderer = PIXI.autoDetectRenderer(962, 553);
            renderer.view.className = "rendererView";

            // add the renderer view element to the DOM
            document.body.appendChild(renderer.view);

            requestAnimationFrame( animate );
            // var button1 =
            function animate() {
                requestAnimationFrame( animate );
                renderer.render(stage);
            }
            return stage;
        }
    }
})();
