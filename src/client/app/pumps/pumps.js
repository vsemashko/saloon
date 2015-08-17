(function () {
    'use strict';

    angular
        .module('app.pumps')
        .controller('Pumps', Pumps);

    Pumps.$inject = ['$q', 'dataservice', 'logger'];

    function Pumps($q, dataservice, logger) {

        /*jshint validthis: true */
        var vm = this;
        vm.init = init;
        vm.pumps = [];
        vm.liquids = [];
        vm.ingredients = [];

        vm.savePumps = savePumps;
        vm.title = 'Pumps config';

        activate();

        function init(pump) {
            _.remove(vm.liquids, 'id', pump.liquid.id);
            vm.liquids.unshift(pump.liquid);
        }

        function activate() {
            var promises = [getLiquids(), getPumps(), getIngredients()];
            return $q.all(promises);
        }

        function getPumps() {
            return dataservice.getPumpConfig().then(function (data) {
                vm.pumps = data;
                return vm.pumps;
            });
        }

        function savePumps() {
            return dataservice.savePumpConfig(vm.pumps).then(function (data) {
                logger.success('Pumps config saved');
            });
        }

        function getLiquids() {
            return dataservice.getLiquids().then(function (data) {
                vm.liquids = data;
                return vm.liquids;
            });
        }

        function getIngredients() {
            return dataservice.getIngredients().then(function (data) {
                return vm.ingredients = data;
            });
        }
    }
})();
