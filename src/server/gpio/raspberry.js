var eventEmitter = require('events').EventEmitter,
    util = require('util'),
    Q = require('q'),
    GPIO = require('onoff').Gpio;

var Raspberry = function () {
        var pump1 = new GPIO(3, 'out'),
            pump2 = new GPIO(4, 'out'),
            flowSensor = new GPIO(23, 'in', 'falling'),
            CALIBRATION_FACTOR = 4.5;

        var vm = this;
        vm.pour = pour;
        vm.pulseCount = 0;

        process.on('exit', cleanupGPIO);

        activate();

        //////////////////

        function activate() {
            //flowSensor.watch(processFlowChanges);
        }

        function pour(pump, amount) {
            var activePump = getPump(pump);
            amount = amount ? amount : 100;
            var flowMeasurer = initFlowMeasurer();
            var deferred = Q.defer();
            activePump.writeSync(1);
            var pourInterval = setInterval(function () {
                updateFlowMeasurer(flowMeasurer);
                printFlowMeasurements(flowMeasurer);
                vm.pulseCount = 0;
                if (liquidIsPoured(amount, flowMeasurer)) {
                    stopPouring(pourInterval, activePump);
                    deferred.resolve();
                }

            }, 1000);
            return deferred.promise;
        }

        function stopPouring(pourInterval, activePump) {
            clearInterval(pourInterval);
            activePump.writeSync(0);
            flowSensor.unwatch();
        }

        function updateFlowMeasurer(flowMeasurer) {
            flowMeasurer.flowRate = vm.pulseCount / CALIBRATION_FACTOR;
            flowMeasurer.flowMillilitres = (flowMeasurer.flowRate / 60) * 100;
            flowMeasurer.totalMillilitres += flowMeasurer.flowMillilitres;
        }

        function liquidIsPoured(amount, flowMeasurer) {
            return amount <= flowMeasurer.totalMillilitres;
        }

        function printFlowMeasurements(flowMeasurer) {
            console.log('Flow rate = ' + Math.round(flowMeasurer.flowRate).toString() + ' L/min;' +
                ' Current liquid flowing = ' + Math.round(flowMeasurer.flowMillilitres).toString() + ' ml/Sec;' +
                ' Output liquid flowing = ' + Math.round(flowMeasurer.totalMillilitres) + ' mL');
        }

        function getPump(pump) {
            var activePump;
            switch (pump) {
                case 1:
                    activePump = pump1;
                    break;
                case 2:
                    activePump = pump2;
                    break;
                default :
                    activePump = pump1;
            }
            return activePump;
        }

        function initFlowMeasurer() {
            flowSensor.watch(processFlowChanges);
            return {
                'flowRate': 0.0,
                'flowMillilitres': 0,
                'totalMillilitres': 0
            };
        }

        function processFlowChanges(err, value) {
            if (value) {
                vm.pulseCount++;
            }
        }

        function cleanupGPIO() {
            pump1.unexport();
            flowSensor.unexport();
            console.log('GPIO is cleaned');
        }

    }
    ;

util.inherits(Raspberry, eventEmitter);
module.exports = Raspberry;