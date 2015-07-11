(function () {
    'use strict';

    angular
        .module('app.saloon')
        .controller('Saloon', Saloon);
    function Saloon(dataservice, logger) {
        /*jshint validthis: true */
        var vm = this;
        vm.cocktails = [];
        vm.title = 'Saloon';
        vm.prepareCocktail = prepareCocktail;

        activate();

        function activate() {
            return getCocktails();
        }

        function getCocktails() {
            return dataservice.getCocktails().then(function (data) {
                vm.cocktails = data;
                return vm.cocktails;
            });
        }

        function prepareCocktail() {
            return dataservice.prepareCocktail().then(function (data) {
                logger.success('Cocktail is served!');
            });
        }
    }
})();
