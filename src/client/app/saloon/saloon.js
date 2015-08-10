(function () {
    'use strict';

    angular
        .module('app.saloon')
        .controller('Saloon', Saloon);
    function Saloon(dataservice, logger) {
        /*jshint validthis: true */
        var vm = this;
        vm.cocktails = [];
        vm.selectedCocktail = {};
        vm.title = 'Saloon';
        vm.prepareCocktail = prepareCocktail;

        activate();

        function activate() {
            return getCocktails().then(function(data) {
                vm.selectedCocktail = vm.cocktails[0];
                var commands = [];
                _.each(data, function(item) {
                    commands[item.name] = function() {
                        vm.selectedCocktail = item;
                        prepareCocktail();
                    }
                });
                // Add our commands to annyang
                annyang.addCommands(commands);
                // Start listening.
                annyang.debug(true);
                annyang.setLanguage("ru");
                annyang.start();
            });
        }

        function getCocktails() {
            return dataservice.getCocktails().then(function (data) {
                vm.cocktails = data;
                return vm.cocktails;
            });
        }

        function prepareCocktail() {
            return dataservice.prepareCocktail(vm.selectedCocktail).then(function (data) {
                logger.success('Cocktail is served!');
            });
        }
    }
})();
