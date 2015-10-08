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
        vm.saveLiquids = saveLiquids;
        vm.addNewLiquid = addNewLiquid;
        vm.title = 'Pumps config';

        activate();

        function init(pump) {
            var liquidIndex = _.findIndex(vm.liquids, 'id', pump.liquid.id);
            if (liquidIndex >= 0) {
                pump.liquid = vm.liquids[liquidIndex];
            } else {
                vm.liquids.unshift(pump.liquid);
            }
            vm.selectedIngredient = pump.liquid;
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

        function saveLiquids() {
            return dataservice.saveLiquidsConfig(vm.liquids).then(function (data) {
                logger.success('Liquids config saved');
            });
        }

        function addNewLiquid() {
            var newLiquid = {isNew: true, name: "Default", id: guid()};
            vm.liquids.push(newLiquid);
            vm.selectedIngredient = newLiquid;
        }

        function getLiquids() {
            return dataservice.getLiquids().then(function (data) {
                vm.liquids = data;
                return vm.liquids;
            });
        }

        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }

            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }
    }
})();
