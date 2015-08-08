var Routes = function (app) {
    var vm = this;
    vm.dataService = require('../app.js').dataService;
    vm.raspberry = require('../app.js').raspberry;

    app.get('/api/cocktails', getCocktails);
    app.get('/api/pump-config', getPumpConfiguration);
    app.post('/api/pump-config', savePumpConfiguration);
    app.post('/api/pour', pourLiquid);

    function getCocktails(req, res, next) {
        res.send(vm.dataService.getCocktails());
    }

    function getPumpConfiguration(req, res, next) {
        res.send(vm.dataService.getPumpConfiguration());
    }

    function savePumpConfiguration(req, res, next) {
        vm.dataService.savePumpConfiguration(req.body);
        res.send(req.body);
    }

    function pourLiquid(req, res, next) {
        var preparationSteps = req.body;
        pourSequentially(preparationSteps).done(function () {
            res.send({result: 'Liquid is ready!'});
        });
    }

    function pour(step) {
        return vm.raspberry.pour(step.id, parseInt(step.amount));
    }

    function pourSequentially(steps) {
        var i = 0, length = steps.length;
        return loop(pour(steps[i]), function () {
            i++;
            return {
                next: steps[i],
                done: i === length
            };
        });
    }

    function loop(promise, fn) {
        return promise.then(fn).then(function (wrapper) {
            return !wrapper.done ? loop(pour(wrapper.next), fn) : wrapper.value;
        });
    }
};

module.exports = Routes;