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
        var FULL_BAR_IMAGE = "content/images/full-bar.png";
        var SHELF_IMAGE = "content/images/shelf.png";
        var BAR_IMAGE = "content/images/bar.png";
        var SIGN_BOARD = "content/images/signboard.png";
        var GEAR = "content/images/gear.png";
        var SMALL_GEAR = "content/images/small_gear.png";
        var DEFAULT_COCKTAIL = "content/images/default-cocktail.png";
        var MAKE_BUTTON = "content/images/make.png";
        var MAKE_BUTTON_HIGHLIGHTED = "content/images/make_highlighted.png";
        var MAKE_BUTTON_DISABLED = "content/images/make_disabled.png";
        var VOICE_BUTTON = "content/images/voice.png";
        var BACK_BUTTON = "content/images/back.png";
        var WAIT_IMAGE = "content/images/bartender.png";
        var ERROR_BOARD = "content/images/error_board.png";
        var DISPLAY = {x: 962, y: 553};
        var PREVIOUS_BUTTON_SIZES = [40, 255, 90, 90];
        var NEXT_BUTTON_SIZES = [825, 255, 90, 90];
        var START_BUTTON_SIZES = [425, 340, 125, 125];
        var WAIT_IMAGE_SIZES = [360, 165, 384, 330];
        var ERROR_BOARD_SIZES = [360, 165, 384, 330];
        var MAKE_COCKTAIL_BUTTON_SIZES = [800, 400, 150, 150];
        var VOICE_BUTTON_SIZES = [35, 425, 100, 100];
        var BACK_BUTTON_SIZES = [35, 15, 100, 100];
        var INGREDIENT_START_POSITION = {x: 530, y: 160};
        var INGREDIENT_OFFSET = 35;

        vm.title = config.appTitle;
        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.showSplash = true;
        vm.currentCocktail = {};
        vm.availableIngridients = [];
        vm.showApp = false;
        vm.hideConfig = hideConfig;

        $rootScope.safeApply = function (fn) {
            var phase = this.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };

        window.addEventListener('orientationchange', function () {
            if (window.innerHeight > window.innerWidth) {
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
            getAvailableIngredients().then(getCocktails).then(function (data) {
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
                    vm.isBusy = false;
                });
            });
        }

        function activateScene(data) {
            var stage = new PIXI.Stage(0x000000, true);
            vm.stage = stage;

            var loader = PIXI.loader;

            _.each(data, function (item) {
                if (item.image) {
                    loader.add(item.name, item.image);
                }
            });

            loader
                // add resources
                .add('SPLASH_SCREEN_IMAGE', SPLASH_SCREEN_IMAGE)
                .add('BAR_IMAGE', BAR_IMAGE)
                .add('SIGN_BOARD', SIGN_BOARD)
                .add('GEAR', GEAR)
                .add('SMALL_GEAR', SMALL_GEAR)
                .add('DEFAULT_COCKTAIL', DEFAULT_COCKTAIL)
                .add('MAKE_BUTTON', MAKE_BUTTON)
                .add('MAKE_BUTTON_HIGHLIGHTED', MAKE_BUTTON_HIGHLIGHTED)
                .add('MAKE_BUTTON_DISABLED', MAKE_BUTTON_DISABLED)
                .add('VOICE_BUTTON', VOICE_BUTTON)
                .add('BACK_BUTTON', BACK_BUTTON)
                .add('WAIT_IMAGE', WAIT_IMAGE)
                .add('ERROR_BOARD', ERROR_BOARD)
                .add('FULL_BAR_IMAGE', FULL_BAR_IMAGE)
                .add('SHELF_IMAGE', SHELF_IMAGE)
                .load(function (loader, resources) {
                    stage.resources = resources;
                    var splashScreen = new PIXI.Sprite(resources.SPLASH_SCREEN_IMAGE.texture);
                    var playButton = new InteractiveArea(stage, {
                        sizes: START_BUTTON_SIZES,
                        onClick: function (stage) {
                            setTimeout(function () {
                                stage.removeChildren();
                                createFullBarScene(stage, data);
                            })
                        }
                    });
                    stage.addChild(splashScreen);
                    stage.addChild(playButton);
                    var renderer = PIXI.autoDetectRenderer(DISPLAY.x, DISPLAY.y);
                    renderer.view.className = "rendererView";
                    $(renderer.view).on('touchstart click', goFullscreen);
                    $('.canvas').append(renderer.view);
                    requestAnimationFrame(animate);

                    function animate() {
                        requestAnimationFrame(animate);
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

        function addBackButton(stage, currentScene) {
            var backButton = new InteractiveArea(stage, {
                sizes: BACK_BUTTON_SIZES,
                texture: stage.resources.BACK_BUTTON.texture,
                onClick: function () {
                    setTimeout(function () {
                        stage.removeChildren();
                        createFullBarScene(stage, stage.data);
                    });
                }
            });
            currentScene.addChild(backButton);
            currentScene.backButton = backButton;
        }

        function checkMissingIngredients(data) {
            var hasMissingIngredients = false;
            var availableIngredientIds = _.map(vm.availableIngridients, "id");
            _.each(data.bar_ingredients, function (ingredient) {
                ingredient.missing = !_.contains(availableIngredientIds, ingredient.id);
                hasMissingIngredients = hasMissingIngredients || ingredient.missing;
            });
            return hasMissingIngredients;
        }

        function createCocktailScene(stage, position, data, texture) {
            // create a background..
            var currentScene = new PIXI.Sprite(texture);
            vm.currentScene = currentScene;
            // add background to stage..
            currentScene.x = position.x;
            currentScene.data = data;

            var allIngredientsExist = !checkMissingIngredients(data);
            addCocktailNameBoard(stage, currentScene);
            addCocktailImage(data, stage, currentScene);
            addGears(stage, currentScene);
            addVoiceButton(stage, currentScene);
            addBackButton(stage, currentScene);
            addIngredientsBoard(data, currentScene);
            if (allIngredientsExist) {
                addPrepareCocktailButton(stage, currentScene);
            } else {
                addDisabledPrepareCocktailButton(stage, currentScene);
            }
            stage.addChild(currentScene);
            return currentScene;
        }

        function addDisabledPrepareCocktailButton(stage, currentScene) {
            var makeCocktailButtonDisabled = new InteractiveArea(stage, {
                sizes: MAKE_COCKTAIL_BUTTON_SIZES,
                texture: stage.resources.MAKE_BUTTON_DISABLED.texture
            });
            currentScene.addChild(makeCocktailButtonDisabled);
        }

        function addIngredientsBoard(data, currentScene) {
            var allIngredients = data.bar_ingredients.concat(data.ingredients);

            _.each(allIngredients, function (ingredient, index) {
                var text = new PIXI.Text(ingredient.name + " " + ingredient.amount, {
                    font: "18px Lcchalk",
                    fill: !ingredient.missing ? "white" : "red"
                });
                text.x = INGREDIENT_START_POSITION.x;
                text.y = INGREDIENT_START_POSITION.y + index * INGREDIENT_OFFSET;
                currentScene.addChild(text);
            });
        }

        function addVoiceButton(stage, currentScene) {
            var voiceButton = new InteractiveArea(stage, {
                sizes: VOICE_BUTTON_SIZES,
                texture: stage.resources.VOICE_BUTTON.texture,
                onClick: function () {
                }
            });
            currentScene.addChild(voiceButton);
            currentScene.voiceButton = voiceButton;
        }

        function addCocktailImage(data, stage, currentScene) {
            var cocktail = data.image ? new PIXI.Sprite(stage.resources[data.name].texture) : new PIXI.Sprite(stage.resources.DEFAULT_COCKTAIL.texture);
            cocktail.interactive = true;
            cocktail.x = 200 + (300 - cocktail.width) / 2;
            cocktail.y = 553 - 53 - cocktail.height;

            currentScene.addChild(cocktail);
        }

        function addCocktailNameBoard(stage, currentScene) {
            var signBoard = new PIXI.Sprite(stage.resources.SIGN_BOARD.texture);
            signBoard.y = -25;
            signBoard.x = 175;
            var text = new PIXI.Text(currentScene.data.name, {
                font: "35px Westerlandc",
                fill: "white",
                align: 'center',
                wordWrap: true,
                wordWrapWidth: 300
            });
            text.y = 100 + (100 - text.height) / 2;
            text.x = 150 - text.width / 2;
            signBoard.addChild(text);
            currentScene.addChild(signBoard);
        }

        function addGears(stage, scene) {
            var gear = new PIXI.Sprite(stage.resources.GEAR.texture);
            gear.interactive = true;
            gear.x = 875;
            gear.y = 50;
            gear.pivot = new PIXI.Point(25, 25);
            gear.tap = function () {
                if (vm.isBusy) {
                    return;
                }
                $rootScope.safeApply(function () {
                    vm.showApp = true;
                    $location.path('/pumps');
                });
            };
            gear.click = function () {
                if (vm.isBusy) {
                    return;
                }
                $rootScope.safeApply(function () {
                    vm.showApp = true;
                    $location.path('/pumps');
                });
            };

            requestAnimationFrame(animateGear);
            function animateGear() {
                requestAnimationFrame(animateGear);
                gear.rotation += 0.02;
            }

            var smallGear = new PIXI.Sprite(stage.resources.SMALL_GEAR.texture);
            smallGear.interactive = true;
            smallGear.tap = function () {
                if (vm.isBusy) {
                    return;
                }
                $rootScope.safeApply(function () {
                    vm.showApp = true;
                    $location.path('/pumps');
                });
            };
            smallGear.click = function () {
                if (vm.isBusy) {
                    return;
                }
                $rootScope.safeApply(function () {
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

            scene.addChild(gear);
            scene.addChild(smallGear);
        }

        function addPrepareCocktailButton(stage, currentScene) {
            var makeCocktailClickHandler = function () {
                makeCocktailButtonHighlighted.visible = true;
                makeCocktailButtonHighlighted.interactive = false;
                currentScene.backButton.interactive = false;
                currentScene.voiceButton.interactive = false;
                makeCocktailButton.interactive = false;
                vm.isBusy = true;
                stage.swappableContainer.interactive = false;
                var waitImage = new InteractiveArea(stage, {
                    sizes: WAIT_IMAGE_SIZES,
                    texture: stage.resources.WAIT_IMAGE.texture
                });
                currentScene.addChild(waitImage);
                prepareCocktail().then(function () {
                    vm.isBusy = false;
                    stage.swappableContainer.interactive = true;
                    makeCocktailButton.interactive = true;
                    makeCocktailButtonHighlighted.interactive = true;
                    currentScene.backButton.interactive = true;
                    currentScene.voiceButton.interactive = true;
                    currentScene.removeChild(waitImage);
                });
            };

            var makeCocktailButtonHighlighted = new InteractiveArea(stage, {
                sizes: MAKE_COCKTAIL_BUTTON_SIZES,
                texture: stage.resources.MAKE_BUTTON_HIGHLIGHTED.texture,
                onClick: makeCocktailClickHandler
            });
            var makeCocktailButton = new InteractiveArea(stage, {
                sizes: MAKE_COCKTAIL_BUTTON_SIZES,
                texture: stage.resources.MAKE_BUTTON.texture,
                onClick: makeCocktailClickHandler
            });
            var showHighlightedButton = false;
            requestAnimationFrame(animateMakeCocktailButton);
            function animateMakeCocktailButton() {
                setTimeout(function () {
                    requestAnimationFrame(animateMakeCocktailButton);
                    if (makeCocktailButton.interactive) {
                        makeCocktailButtonHighlighted.visible = !showHighlightedButton;
                        showHighlightedButton = !showHighlightedButton;
                    } else {
                        makeCocktailButtonHighlighted.visible = true;
                    }
                }, 1000);

            }

            currentScene.addChild(makeCocktailButton);
            currentScene.addChild(makeCocktailButtonHighlighted);
        }

        function createFullBarScene(stage, data) {
            var initialPoint, finalPoint;
            var countShelfs = data.length / 2;
            var realHeight = 150 + countShelfs * 200 - DISPLAY.y;
            var fullBarScene = new PIXI.Sprite(stage.resources.FULL_BAR_IMAGE.texture);
            fullBarScene.interactive = true;

            var emptyContainer = new PIXI.Graphics();
            emptyContainer.interactive = true;
            emptyContainer.hitArea = new PIXI.Rectangle(0, 0, DISPLAY.x, realHeight + DISPLAY.y);
            emptyContainer.touchmove = function (interactionData) {
                if (emptyContainer.interactive) {
                    finalPoint = interactionData.data.getLocalPosition(this.parent);
                    var xAbs = Math.abs(initialPoint.x - finalPoint.x);
                    var yAbs = Math.abs(initialPoint.y - finalPoint.y);
                    if (yAbs > xAbs) {
                        if (finalPoint.y < initialPoint.y && emptyContainer.y > -realHeight) {
                            initialPoint = interactionData.data.getLocalPosition(this.parent);
                            emptyContainer.y -= 20;
                        } else if (finalPoint.y > initialPoint.y && emptyContainer.y < 0) {
                            initialPoint = interactionData.data.getLocalPosition(this.parent);
                            emptyContainer.y += 20;
                        }
                    }
                }
            };

            emptyContainer.touchstart = function (interactionData) {
                if (emptyContainer.interactive) {
                    initialPoint = interactionData.data.getLocalPosition(this.parent);
                }
            };

            var voiceButton = new InteractiveArea(stage, {
                sizes: VOICE_BUTTON_SIZES,
                texture: stage.resources.VOICE_BUTTON.texture,
                onClick: function () {
                }
            });

            //add shelf's
            for (var i = 0; i < countShelfs; i++) {
                var shelf = new PIXI.Sprite(stage.resources.SHELF_IMAGE.texture);
                shelf.x = 200;
                shelf.y = 150 + 200 * i;
                emptyContainer.addChild(shelf);
                for (var j = 0; j < 2 && i * 2 + j < data.length; j++) {
                    var item = data[i * 2 + j];
                    var cocktail = item.image ? PIXI.Sprite.fromImage(item.image) : new PIXI.Sprite(stage.resources.DEFAULT_COCKTAIL.texture);
                    cocktail.interactive = true;
                    cocktail.data = item;
                    cocktail.scale.x = 0.5;
                    cocktail.scale.y = 0.5;
                    cocktail.x = 200 + 300 + (j % 2 === 0 ? -cocktail.width : 0);
                    cocktail.y = 150 + 20 - cocktail.height + i * 200;
                    cocktail.tap = function () {
                        var item = this.data;
                        setTimeout(function () {
                            vm.currentCocktail = item;
                            createBarScene(stage, data);
                        });
                    };

                    var text = new PIXI.Text(item.name, {
                        font: "35px Westerlandc",
                        fill: "white",
                        align: 'center',
                        wordWrap: true,
                        wordWrapWidth: 300 - cocktail.width
                    });
                    text.y = 150 - text.height + i * 200;
                    var offset = 0;
                    if (j % 2 === 0) {
                        offset = 300 - text.width - cocktail.width;
                        text.x = 200 + offset - offset / 2;
                    } else {
                        offset = 300 - text.width - cocktail.width;
                        text.x = 200 + 300 + cocktail.width + offset / 2;
                    }
                    emptyContainer.addChild(text);

                    emptyContainer.addChild(cocktail);
                }

            }
            fullBarScene.addChild(emptyContainer);
            fullBarScene.addChild(voiceButton);
            addGears(stage, fullBarScene);
            stage.addChild(fullBarScene);

        }

        function createBarScene(stage, data) {
            stage.data = data;
            var swappableContainer = new SwappableContainer(
                stage, DISPLAY,
                {
                    next: goToCocktail,
                    previous: goToCocktail,
                    current: createCocktailScene(stage, {
                        x: 0,
                        y: 0
                    }, vm.currentCocktail, stage.resources.BAR_IMAGE.texture),
                    items: data,
                    onSwapLeft: function () {
                    },
                    onSwapRight: function () {
                    }
                });
            stage.swappableContainer = swappableContainer;
            stage.addChild(swappableContainer);
            swappableContainer.current.bringToFront();
            var previous = new InteractiveArea(stage, {
                sizes: PREVIOUS_BUTTON_SIZES,
                onClick: function () {
                    if (!vm.isBusy) {
                        swappableContainer.onSwapRight();
                    }
                }
            });
            var next = new InteractiveArea(stage, {
                sizes: NEXT_BUTTON_SIZES,
                onClick: function () {
                    if (!vm.isBusy) {
                        swappableContainer.onSwapLeft();
                    }
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

        function getAvailableIngredients() {
            return dataservice.getPumpConfig().then(function (data) {
                vm.availableIngridients = _.map(data, 'liquid');
                return vm.availableIngridients;
            });
        }

        function prepareCocktail() {
            return dataservice.prepareCocktail(vm.currentCocktail).then(function (data) {
                logger.success('Cocktail is served!');
            }).catch(handleException);
        }

        function refreshScene() {
            if (vm.stage.data) {
                getAvailableIngredients().then(function () {
                    vm.stage.removeChildren();
                    createBarScene(vm.stage, vm.stage.data);
                });
            }
        }

        function handleException(error) {
            logger.error(error.data);
            var errorBoard = new InteractiveArea(vm.stage, {
                sizes: ERROR_BOARD_SIZES,
                texture: vm.stage.resources.ERROR_BOARD.texture
            });
            var errorText = new PIXI.Text('Отсутствует:', {
                font: "30px Lcchalk",
                fill: "red"
            });
            errorText.x = 400;
            errorText.y = 200;
            var missingIngridient = new PIXI.Text(error.data, {
                font: "30px Lcchalk",
                fill: "red"
            });
            missingIngridient.x = 400;
            missingIngridient.y = 240;
            vm.currentScene.addChild(errorBoard);
            vm.currentScene.addChild(errorText);
            vm.currentScene.addChild(missingIngridient);
            setTimeout(function () {
                vm.currentScene.removeChild(errorText);
                vm.currentScene.removeChild(missingIngridient);
                vm.currentScene.removeChild(errorBoard);
                refreshScene();
            }, 2000);
        }

        function hideConfig() {
            vm.showApp = false;
            refreshScene();
        }
    }
})();
