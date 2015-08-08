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
            return getCocktails().then(function (cocktails) {
                vm.selectedCocktail = vm.cocktails[0];
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
