var eventEmitter = require('events').EventEmitter,
    util = require('util'),
    Q = require('q'),
    GPIO = require('onoff').Gpio;

var Raspberry = function () {
    var pump = new GPIO(3, 'out'),
        flowSensor = new GPIO(23, 'in', 'falling'),
        CALIBRATION_FACTOR = 4.5;

    var vm = this;
    vm.pour = pour;
    vm.pulseCount = 0;

    process.on('exit', cleanupGPIO);

    activate();

    //////////////////

    function activate() {
        flowSensor.watch(processFlowChanges);
    }

    function pour() {
        var count = 0;

        var flowRate = 0.0,
            flowMillilitres = 0,
            totalMillilitres = 0;

        var deferred = Q.defer();
        pump.writeSync(1);
        var pourInterval = setInterval(function () {
            flowRate = vm.pulseCount / CALIBRATION_FACTOR;
            flowMillilitres = (flowRate / 60) * 100;
            totalMillilitres += flowMillilitres;
            console.log('Flow rate = ' + Math.round(flowRate).toString() + ' L/min;' +
                ' Current liquid flowing = ' + Math.round(flowMillilitres).toString() + ' ml/Sec;' +
                ' Output liquid flowing = ' + Math.round(totalMillilitres) + ' mL');
            vm.pulseCount = 0;
            count++;
            if (count === 10) {
                clearInterval(pourInterval);
                pump.writeSync(0);
                deferred.resolve();
            }

        }, 1000);
        return deferred.promise;
    }

    function processFlowChanges(err, value) {
        if (value) {
            vm.pulseCount++;
        }
    }

    function cleanupGPIO() {
        pump.unexport();
        flowSensor.unexport();
        console.log('GPIO is cleaned');
    }

};

util.inherits(Raspberry, eventEmitter);
module.exports = Raspberry;

