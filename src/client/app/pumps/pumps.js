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

        vm.savePumps = savePumps;
        vm.title = 'Pumps config';

        activate();

        function init(pump) {
            _.remove(vm.liquids, 'id', pump.liquid.id);
            vm.liquids.unshift(pump.liquid);
        }

        function activate() {
            var promises = [getLiquids(), getPumps()];
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
    }
})();
