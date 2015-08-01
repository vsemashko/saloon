var Routes = function (app) {
    var vm = this;
    vm.dataService = require('../app.js').dataService;
    vm.raspberry = require('../app.js').raspberry;

    app.get('/api/cocktails', getCocktails);
    app.get('/api/pour', pourLiquid);
    app.get('/api/pump-config', getPumpConfiguration);

    function getCocktails(req, res, next) {
        res.send(vm.dataService.getCocktails());
    }

    function getPumpConfiguration(req, res, next) {
        res.send(vm.dataService.getPumpConfig());
    }

    function pourLiquid(req, res, next) {
        vm.raspberry.pour('Whiskey', parseInt(req.query.amount)).then(function () {
            vm.raspberry.pour('Cola', parseInt(req.query.amount)).then(function () {
                res.send({result: 'Liquid is ready!'});
            });
        });
    }
};

module.exports = Routes;