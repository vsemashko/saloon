var eventEmitter = require('events').EventEmitter,
    util = require('util'),
    Q = require('q');

var Raspberry = function () {
    var vm = this;
    vm.pour = pour;
    vm.pulseCount = 0;

    process.on('exit', cleanupGPIO);

    activate();

    //////////////////

    function activate() {
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