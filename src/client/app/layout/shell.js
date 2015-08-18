(function () {
    'use strict';

    angular
        .module('app.layout')
        .controller('Shell', Shell);

    Shell.$inject = ['$rootScope', 'config', 'logger', 'dataservice', '$location'];

    function Shell($rootScope, config, logger, dataservice, $location) {
        /*jshint validthis: true */
        var vm = this;

        var SPLASH_SCREEN_IMAGE = "content/images/splash-screen.png";
        var BAR_IMAGE = "content/images/bar.png";
        var SIGN_BOARD = "content/images/signboard.png";
        var GEAR = "content/images/gear.png";
        var SMALL_GEAR = "content/images/small_gear.png";
        var DISPLAY =  {x: 962, y: 553};
        var PREVIOUS_BUTTON_SIZES = [40, 255, 90, 90];
        var NEXT_BUTTON_SIZES = [825, 255, 90, 90];
        var START_BUTTON_SIZES = [425, 340, 125, 125];
        var MAKE_COCKTAIL_BUTTON_SIZES = [260, 440, 410, 100];
        var INGREDIENT_START_POSITION = {x: 530, y: 160};
        var INGREDIENT_OFFSET = 35;

        vm.title = config.appTitle;
        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.showSplash = true;
        vm.currentCocktail = {};
        vm.showApp = false;

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

        window.addEventListener('orientationchange', function ()
        {
            if (window.innerHeight > window.innerWidth)
            {
                document.getElementsByTagName('body').style.transform = "rotate(90deg)";
            }
        });

        function goFullscreen() {
            // Must be called as a result of user interaction to work
            this.webkitRequestFullscreen();
        }

        activate();

        function activate() {
            logger.success(config.appTitle + ' loaded!', null);
            getCocktails().then(function(data) {
                vm.currentCocktail = data[0];
                var stage = activateScene(data);
                dataservice.ready().then(function () {
                    var commands = {
                        'поехали': function () {
                            createBarScene(stage, data);
                        },
                        'выход': function () {
                            stage.removeChildren();
                            // create a background..
                            var background = new PIXI.Sprite(stage.resources.SPLASH_SCREEN_IMAGE.texture);
                            // add background to stage..
                            stage.addChild(background);
                        }
                    };
                    // Add our commands to annyang
                    annyang.addCommands(commands);
                    // Start listening.
                    annyang.debug(true);
                    annyang.setLanguage("ru");
                    //annyang.start();
                });
            });
        }

        function activateScene(data) {
            var stage = new PIXI.Stage(0x000000, true);
            PIXI.loader
                // add resources
                .add('SPLASH_SCREEN_IMAGE', SPLASH_SCREEN_IMAGE)
                .add('BAR_IMAGE', BAR_IMAGE)
                .add('SIGN_BOARD', SIGN_BOARD)
                .add('GEAR', GEAR)
                .add('SMALL_GEAR', SMALL_GEAR)
                .load(function (loader, resources) {
                    stage.resources = resources;
                    var splashScreen = new PIXI.Sprite(resources.SPLASH_SCREEN_IMAGE.texture);
                    var playButton = new InteractiveArea(stage, {
                        sizes: START_BUTTON_SIZES,
                        onClick: function(stage) {
                            createBarScene(stage, data);
                        }
                    });

                    stage.addChild(splashScreen);
                    stage.addChild(playButton);

                    var renderer = PIXI.autoDetectRenderer(DISPLAY.x, DISPLAY.y);
                    renderer.view.className = "rendererView";
                    $(renderer.view).on('touchstart click', goFullscreen);
                    $('.canvas').append(renderer.view);
                    requestAnimationFrame( animate );

                    function animate() {
                        requestAnimationFrame( animate );
                        if (!vm.showApp) {
                            renderer.render(stage);
                        }
                    }
                });
            return stage;
        }

        function goToCocktail(stage, position, data) {
            vm.currentCocktail = data;
            return createCocktailScene(stage, position, data, stage.resources.BAR_IMAGE.texture);
        }

        function createCocktailScene(stage, position, data, texture) {
            // create a background..
            var currentScene = new PIXI.Sprite(texture);
            // add background to stage..
            currentScene.x = position.x;
            currentScene.data = data;

            var signBoard = new PIXI.Sprite(stage.resources.SIGN_BOARD.texture);
            signBoard.y = -25;
            signBoard.x = 100;
            var text = new PIXI.Text(currentScene.data.name, {
                font:"35px Westerlandc",
                fill:"white",
                align: 'center',
                wordWrap: true,
                wordWrapWidth: 300
            });
            text.y = 100 + (100 - text.height) / 2;
            text.x = 150 - text.width / 2;
            signBoard.addChild(text);
            currentScene.addChild(signBoard);

            var gear = new PIXI.Sprite(stage.resources.GEAR.texture);
            gear.interactive = true;
            gear.x = 875;
            gear.y = 50;
            gear.pivot = new PIXI.Point(25, 25);
            gear.tap = function() {
                $rootScope.safeApply(function() {
                    vm.showApp = true;
                    $location.path('/pumps');
                });
            };
            gear.click = function() {
                $rootScope.safeApply(function() {
                    vm.showApp = true;
                    $location.path('/pumps');
                });
            };

            requestAnimationFrame(animateGear);
            function animateGear() {
                requestAnimationFrame(animateGear);
                gear.rotation += 0.02;
            }
            currentScene.addChild(gear);

            var smallGear = new PIXI.Sprite(stage.resources.SMALL_GEAR.texture);
            smallGear.interactive = true;
            smallGear.tap = function() {
                $rootScope.safeApply(function() {
                    vm.showApp = true;
                    $location.path('/pumps');
                });
            };
            smallGear.click = function() {
                $rootScope.safeApply(function() {
                    vm.showApp = true;
                    $location.path('/pumps');
                });
            };
            smallGear.x = 910;
            smallGear.y = 62;
            smallGear.pivot = new PIXI.Point(12, 12);

            requestAnimationFrame(animateSmallGear);
            function animateSmallGear() {
                requestAnimationFrame(animateSmallGear);
                smallGear.rotation -= 0.02;
            }
            currentScene.addChild(gear);
            currentScene.addChild(smallGear);

            var makeCocktail = new InteractiveArea(stage, {
                sizes: MAKE_COCKTAIL_BUTTON_SIZES,
                onClick: function() {
                    prepareCocktail();
                }
            });
            currentScene.addChild(makeCocktail);


            var allIngredients = data.bar_ingredients.concat(data.ingredients);

            _.each(allIngredients, function(ingredient, index) {
                var text = new PIXI.Text(ingredient.name + " " + ingredient.amount, {font:"18px Lcchalk", fill:"white"});
                text.x = INGREDIENT_START_POSITION.x;
                text.y = INGREDIENT_START_POSITION.y + index * INGREDIENT_OFFSET;
                currentScene.addChild(text);
            });

            stage.addChild(currentScene);
            return currentScene;
        }

        function createBarScene(stage, data) {
            var swappableContainer = new SwappableContainer(
                stage, DISPLAY,
                {
                    next: goToCocktail,
                    previous: goToCocktail,
                    current: createCocktailScene(stage, {x:0, y:0}, vm.currentCocktail, stage.resources.BAR_IMAGE.texture),
                    items: data,
                    onSwapLeft: function() {
                    },
                    onSwapRight:function() {
                    }
                });
            stage.addChild(swappableContainer);
            swappableContainer.current.bringToFront();
            var previous = new InteractiveArea(stage, {
                sizes: PREVIOUS_BUTTON_SIZES,
                onClick: function() {
                    swappableContainer.onSwapRight();
                }
            });
            var next = new InteractiveArea(stage, {
                sizes: NEXT_BUTTON_SIZES,
                onClick: function() {
                    swappableContainer.onSwapLeft();
                }
            });
            swappableContainer.addChild(next);
            swappableContainer.addChild(previous);
        }

        function getCocktails() {
            return dataservice.getCocktails().then(function (data) {
                vm.cocktails = data;
                return vm.cocktails;
            });
        }

        function prepareCocktail() {
            return dataservice.prepareCocktail(vm.currentCocktail).then(function (data) {
                logger.success('Cocktail is served!');
            });
        }
    }
})();
