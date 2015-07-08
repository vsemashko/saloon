(function() {
    'use strict';

    angular
        .module('app.saloon')
        .controller('Saloon', Saloon);
    function Saloon(dataservice, logger) {
        /*jshint validthis: true */
        var vm = this;
        vm.cocktails = [];
        vm.title = 'Saloon';

        activate();

        function activate() {
            return getCocktails();
        }

        function getCocktails() {
            return dataservice.getCocktails().then(function(data) {
                vm.cocktails = data;
                return vm.cocktails;
            });
        }
    }
})();
