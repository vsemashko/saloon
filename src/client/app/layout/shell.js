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

        function goToBar(stage) {
            // create a background..
            var background = PIXI.Sprite.fromImage("content/images/bar.png");
            // add background to stage..
            stage.addChild(background);
        }

        function activate() {
            logger.success(config.appTitle + ' loaded!', null);
            var stage = activateScene();
            dataservice.ready().then(function () {
                var commands = [];
                commands = {
                    'поехали': function() {
                        goToBar(stage);
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

            var playButton = new PIXI.Graphics();

            playButton.lineStyle(2, 0x0000FF, 1);
            playButton.drawRect(425, 340, 125, 125);

            playButton.interactive = true;

            playButton.hitArea = new PIXI.Rectangle(425, 340, 125, 125);

            playButton.tap = function() {
                goToBar(stage);
            };

            playButton.click = function() {
                goToBar(stage);
            };

            // create a background..
            var background = PIXI.Sprite.fromImage("content/images/splash-screen.png");

            // add background to stage..
            stage.addChild(background);
            stage.addChild(playButton);



            // create a renderer instance.
            var renderer = PIXI.autoDetectRenderer(962, 553);
            renderer.view.className = "rendererView";

            // add the renderer view element to the DOM
            document.body.appendChild(renderer.view);
            function goFullscreen() {
                // Must be called as a result of user interaction to work
                renderer.view.webkitRequestFullscreen();
            }
            $(renderer.view).on('touchstart click', goFullscreen);

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
