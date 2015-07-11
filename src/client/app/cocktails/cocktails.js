(function () {
    'use strict';

    angular
        .module('app.cocktails')
        .controller('Cocktails', Cocktails);

    Cocktails.$inject = ['$q', 'dataservice', 'logger'];

    function Cocktails($q, dataservice, logger) {

        /*jshint validthis: true */
        var vm = this;

        vm.cocktails = [];
        vm.title = 'Cocktails recipes';

        activate();

        function activate() {
            var promises = [getCocktails()];
            return $q.all(promises);
        }

        function getCocktails() {
            return dataservice.getCocktails().then(function (data) {
                vm.cocktails = data;
                return vm.cocktails;
            });
        }
    }
})();
