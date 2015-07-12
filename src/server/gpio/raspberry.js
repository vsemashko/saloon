var gpio = require('rpi-gpio');
var eventEmitter = require('events').EventEmitter;
var util = require('util');
var Q = require('q');

var Raspberry = function () {
    var PUMP_PIN = 3;
    var WATER_FLOW_SENSOR_PIN = 23;

    var vm = this;
    vm.pour = pour;

    process.on('exit', cleanupGPIO);
    gpio.on('change', processFlowChanges);

    activate();

    //////////////////

    function activate() {
        gpio.setMode(gpio.MODE_BCM);
        gpio.setup(PUMP_PIN, gpio.DIR_OUT, callback);
        gpio.setup(WATER_FLOW_SENSOR_PIN, gpio.DIR_IN, callback);
    }

    function callback(data) {
        console.log(data);
    }

    function pour() {
        var deferred = Q.defer();
        gpio.write(PUMP_PIN, 1, function (response) {
            console.log(response);
        });
        setTimeout(function () {
            gpio.write(PUMP_PIN, 0, function (response) {
                console.log(response);
            });
            deferred.resolve();
        }, 3000);
        return deferred.promise;
    }

    function processFlowChanges(channel, value) {
        console.log('Channel ' + channel + ' value is now ' + value);
    }

    function cleanupGPIO() {
        gpio.destroy(function () {
            console.log('GPIO cleanup finished');
        });
    }

};

util.inherits(Raspberry, eventEmitter);
module.exports = Raspberry;

