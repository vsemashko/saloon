var LocalDataService = function () {

    var vm = this;
    vm.jsonfileservice = require('./utils/jsonfileservice')();
    vm.getCocktails = getCocktails;
    vm.getPumpConfiguration = getPumpConfiguration;

    //////////////////

    function getCocktails() {
        return vm.jsonfileservice.getJsonFromFile('/../../data/coctails.json');
    }

    function getPumpConfiguration(req, res, next) {
        return vm.jsonfileservice.getJsonFromFile('/../../data/pumpConfig.json');
    }

};

module.exports = LocalDataService;