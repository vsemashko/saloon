var eventEmitter = require('events').EventEmitter,
    util = require('util'),
    Q = require('q'),
    GPIO = require('onoff').Gpio;

var Raspberry = function () {
    var CALIBRATION_FACTOR = 6;
    var EMPTY_ATTEMPTS_COUNT = 50;

    var vm = this;
    vm.dataService = require('../app.js').dataService;

    vm.pour = pour;
    vm.pulseCount = 0;
    vm.pumps = [];
    vm.backlight;

    process.on('exit', cleanupGPIO);

    activate();

    //////////////////

    function activate() {
        var pumpsConfig = vm.dataService.getPumpConfiguration()[0].data,
            pump,
            config;
        vm.pumpsConfig = pumpsConfig;
        vm.backlight = new GPIO(27, 'out');
        for (var i = 0, length = pumpsConfig.length; i < length; i++) {
            config = pumpsConfig[i];
            pump = initPump(config);
            vm.pumps.push(pump);
        }

        var liquids = vm.dataService.getLiquids()[0].data;
        vm.liquids = {};
        for (i = 0, length = liquids.length; i < length; i++) {
            vm.liquids[liquids[i].id] = liquids[i].name;
        }
    }

    function initPump(config) {
        var pump = {};
        pump.gpio = new GPIO(config.pumpId, 'out');
        pump.flowSensor = new GPIO(config.measurerId, 'in', 'falling');
        pump.liquid = config.liquid.id;
        logPumpConfig(config);
        return pump;
    }

    function logPumpConfig(config) {
        console.log('Init pump');
        console.log('Pump id = ' + config.pumpId);
        console.log('Liquid measurer id = ' + config.measurerId);
        console.log('Liquid = ' + config.liquid.id);
    }

    function pour(liquid, amount) {
        amount = amount ? amount : 50;
        vm.backlight.writeSync(1);
        var activePump = getPump(liquid),
            deferred = Q.defer();
        if (!activePump) {
            deferred.reject(vm.liquids[liquid]);
            return deferred.promise;
        }
        var flowMeasurer = initFlowMeasurer(activePump);
        activePump.gpio.writeSync(1);
        var pourInterval = setInterval(function () {
            updateFlowMeasurer(flowMeasurer);
            printFlowMeasurements(flowMeasurer);
            vm.pulseCount = 0;
            if (liquidIsPoured(amount, flowMeasurer)) {
                stopPouring(pourInterval, activePump);
                vm.backlight.writeSync(0);
                deferred.resolve({success: true});
            } else if (liquidIsEnded(flowMeasurer)) {
                stopPouring(pourInterval, activePump);
                vm.backlight.writeSync(0);
                removeLiquidFromPump(liquid);
                deferred.reject(vm.liquids[liquid]);
            }

        }, 100);
        return deferred.promise;
    }

    function stopPouring(pourInterval, activePump) {
        clearInterval(pourInterval);
        activePump.gpio.writeSync(0);
        activePump.flowSensor.unwatchAll();
    }

    function updateFlowMeasurer(flowMeasurer) {
        flowMeasurer.flowRate = vm.pulseCount / CALIBRATION_FACTOR;
        flowMeasurer.flowMillilitres = (flowMeasurer.flowRate / 60) * 100;
        flowMeasurer.totalMillilitres += flowMeasurer.flowMillilitres;
    }

    function liquidIsPoured(amount, flowMeasurer) {
        return amount <= flowMeasurer.totalMillilitres;
    }

    function liquidIsEnded(flowMeasurer) {
        if (flowMeasurer.flowMillilitres === 0) {
            flowMeasurer.emptyFlowCount++;
        } else {
            flowMeasurer.emptyFlowCount = 0;
        }
        return flowMeasurer.emptyFlowCount >= EMPTY_ATTEMPTS_COUNT;
    }

    function printFlowMeasurements(flowMeasurer) {
        console.log('Flow rate = ' + Math.round(flowMeasurer.flowRate).toString() + ' L/min;' +
            ' Current liquid flowing = ' + Math.round(flowMeasurer.flowMillilitres).toString() + ' ml/Sec;' +
            ' Output liquid flowing = ' + Math.round(flowMeasurer.totalMillilitres) + ' mL');
    }

    function getPump(liquid) {
        var activePump,
            currentPump;
        for (var i = 0, length = vm.pumps.length; i < length; i++) {
            currentPump = vm.pumps[i];
            if (currentPump.liquid === liquid) {
                activePump = currentPump;
                break;
            }
        }
        return activePump;
    }

    function initFlowMeasurer(activePump) {
        activePump.flowSensor.watch(processFlowChanges);
        return {
            'flowRate': 0.0,
            'flowMillilitres': 0,
            'totalMillilitres': 0,
            'emptyFlowCount': 0
        };
    }

    function processFlowChanges(err, value) {
        vm.pulseCount++;
        //TODO check correct flow changes processing
        /*if (value) {
         console.log('Flow changes, value = ' + value);
         vm.pulseCount = vm.pulseCount + value;
         }*/
    }

    function cleanupGPIO() {
        var currentPump;
        for (var i = 0, length = vm.pumps.length; i < length; i++) {
            currentPump = vm.pumps[i];
            currentPump.gpio.unexport();
            currentPump.flowSensor.unexport();
        }
        vm.backlight.unexport();
        console.log('GPIO is cleaned');
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

};

util.inherits(Raspberry, eventEmitter);
module.exports = Raspberry;