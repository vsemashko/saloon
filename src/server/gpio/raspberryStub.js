var eventEmitter = require('events').EventEmitter,
    util = require('util'),
    Q = require('q');

var Raspberry = function () {
    var vm = this;
    vm.dataService = require('../app.js').dataService;

    vm.pour = pour;
    vm.pulseCount = 0;
    vm.pumps = [];

    process.on('exit', cleanupGPIO);

    activate();

    //////////////////

    function activate() {
        var pumpsConfig = vm.dataService.getPumpConfiguration()[0].data;
        for (var i = 0, length = pumpsConfig.length; i < length; i++) {
            vm.pumps.push(pumpsConfig[i]);
        }
    }

    function pour(pump, amount) {
        var deferred = Q.defer();

        setTimeout(function () {
            deferred.resolve();
        }, 3000);
        return deferred.promise;
    }

    function cleanupGPIO() {
        pump1.unexport();
        flowSensor.unexport();
        console.log('GPIO is cleaned');
    }

};

util.inherits(Raspberry, eventEmitter);
module.exports = Raspberry;