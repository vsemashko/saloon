var gpio = require('rpi-gpio');
var eventEmitter = require('events').EventEmitter;
var util = require('util');
var Q = require('q');

var Raspberry = function () {
    var PUMP_PIN = 4;

    var vm = this;
    vm.pour = pour;

    process.on('exit', cleanupGPIO);

    activate();

    //////////////////

    function activate() {
        gpio.setMode(gpio.MODE_BCM);
        gpio.setup(PUMP_PIN, gpio.DIR_OUT, null);
    }

    function pour() {
        var deferred = Q.defer();
        gpio.output(PUMP_PIN, 1);
        setTimeout(function () {
            gpio.output(PUMP_PIN, 0);
            deferred.resolve();
        }, 3000);
        return deferred.promise;
    }

    function cleanupGPIO() {
        gpio.destroy(function () {
            console.log('GPIO cleanup finished');
        });
    }

};

util.inherits(Raspberry, eventEmitter);
module.exports = Raspberry;

