var Routes = function (app) {
    var vm = this;
    vm.dataService = require('../app.js').dataService;
    vm.raspberry = require('../app.js').raspberry;

    app.get('/api/cocktails', getCocktails);
    app.get('/api/liquids', getLiquids);
    app.get('/api/ingredients', getIngredients);
    app.get('/api/pump-config', getPumpConfiguration);
    app.post('/api/pump-config', savePumpConfiguration);
    app.post('/api/pour', pourLiquid);
    app.post('/api/liquids', saveLiquidsConfiguration);

    function getCocktails(req, res, next) {
        res.send(vm.dataService.getCocktails());
    }

    function getIngredients(req, res, next) {
        res.send(vm.dataService.getIngredients());
    }

    function getLiquids(req, res, next) {
        res.send(vm.dataService.getLiquids());
    }

    function getPumpConfiguration(req, res, next) {
        res.send(vm.dataService.getPumpConfiguration());
    }

    function savePumpConfiguration(req, res, next) {
        vm.dataService.savePumpConfiguration(req.body);
        res.send(req.body);
    }

    function saveLiquidsConfiguration(req, res, next) {
        vm.dataService.saveLiquidsConfiguration(req.body);
        res.send(req.body);
    }

    function pourLiquid(req, res, next) {
        var preparationSteps = req.body;
        pourSequentially(preparationSteps).done(function (error) {
            if (!error) {
                res.send({result: 'Коктейль готов!'});
            } else {
                return next(error);
            }
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
        }, function (error) {
            return error;
        });
    }
};

module.exports = Routes;