var eventEmitter = require('events').EventEmitter,
    util = require('util'),
    Q = require('q'),
    GPIO = require('onoff').Gpio;

var Raspberry = function () {
    var pump = new GPIO(3, 'out'),
        flowSensor = new GPIO(23, 'in', 'falling');

    var vm = this;
    vm.pour = pour;

    process.on('exit', cleanupGPIO);

    activate();

    //////////////////

    function activate() {
        flowSensor.watch(processFlowChanges);
    }

    function pour() {
        var deferred = Q.defer();
        pump.writeSync(1);
        setTimeout(function () {
            pump.writeSync(0);
            deferred.resolve();
        }, 3000);
        return deferred.promise;
    }

    function processFlowChanges(err, value) {
        console.log(value);
    }

    function cleanupGPIO() {
        led.unexport();
        flowSensor.unexport();
    }

};

util.inherits(Raspberry, eventEmitter);
module.exports = Raspberry;

