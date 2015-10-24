var eventEmitter = require('events').EventEmitter,
    util = require('util'),
    Q = require('q');

var Raspberry = function () {
    var vm = this;
    vm.dataService = require('../app.js').dataService;

    vm.pour = pour;
    vm.cleanupPump = cleanupPump;
    vm.reloadConfig = reloadConfig;
    vm.pulseCount = 0;
    vm.pumps = [];

    process.on('exit', cleanupGPIO);

    activate();

    //////////////////

    function activate() {
        var pumpsConfig = vm.dataService.getPumpConfiguration()[0].data;
        vm.pumpsConfig = pumpsConfig;
        for (var i = 0, length = pumpsConfig.length; i < length; i++) {
            vm.pumps.push(pumpsConfig[i]);
        }

        var liquids = vm.dataService.getLiquids()[0].data;
        vm.liquids = {};
        for (i = 0, length = liquids.length; i < length; i++) {
            vm.liquids[liquids[i].id] = liquids[i].name;
        }
    }

    function pour(liquid, amount) {
        var deferred = Q.defer();
        var activePump = getPump(liquid);

        if (!activePump) {
            deferred.reject(vm.liquids[liquid]);
            return deferred.promise;
        }
        if (liquid === 'Vodka') {
            removeLiquidFromPump(liquid);
            deferred.reject(vm.liquids[liquid]);
            return deferred.promise;
        }
        setTimeout(function () {
            deferred.resolve({success: true});
        }, 3000);
        return deferred.promise;
    }

    function cleanupPump(pump) {
        var deferred = Q.defer();
        var activePump = getPumpById(pump.pumpId);
        setTimeout(function () {
            deferred.resolve({success: true});
        }, 3000);
        return deferred.promise;
    }

    function getPump(liquid) {
        var activePump,
            currentPump;
        for (var i = 0, length = vm.pumps.length; i < length; i++) {
            currentPump = vm.pumps[i];
            if (currentPump.liquid.id === liquid) {
                activePump = currentPump;
                break;
            }
        }
        return activePump;
    }

    function getPumpById(pumpId) {
        var activePump,
            currentPump;
        for (var i = 0, length = vm.pumps.length; i < length; i++) {
            currentPump = vm.pumps[i];
            if (currentPump.pumpId === pumpId) {
                activePump = currentPump;
                break;
            }
        }
        return activePump;
    }

    function removeLiquidFromPump(liquid) {
        for (var i = 0, length = vm.pumpsConfig.length; i < length; i++) {
            if (vm.pumpsConfig[i].liquid.id === liquid) {
                vm.pumpsConfig[i].liquid = {
                    id: "empty",
                    name: "-- Пусто --"
                };
                break;
            }
        }
        vm.dataService.savePumpConfiguration(vm.pumpsConfig);
    }

    function cleanupGPIO() {
        vm.pumps.splice(0, vm.pumps.length);
        console.log('GPIO is cleaned');
    }

    function reloadConfig() {
        cleanupGPIO();
        activate();
    }

};

util.inherits(Raspberry, eventEmitter);
module.exports = Raspberry;