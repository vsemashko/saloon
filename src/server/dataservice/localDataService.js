var LocalDataService = function () {

    var vm = this;
    vm.jsonfileservice = require('./utils/jsonfileservice')();
    vm.getCocktails = getCocktails;
    vm.getLiquids = getLiquids;
    vm.getPumpConfiguration = getPumpConfiguration;
    vm.savePumpConfiguration = savePumpConfiguration;

    //////////////////

    function getCocktails() {
        return vm.jsonfileservice.getJsonFromFile('/../../data/cocktails.json');
    }

    function getLiquids() {
        return vm.jsonfileservice.getJsonFromFile('/../../data/liquids.json');
    }

    function getPumpConfiguration(req, res, next) {
        var json = vm.jsonfileservice.getJsonFromFile('/../../data/pumpConfig_custom.json');
        if (!json) {
            json = vm.jsonfileservice.getJsonFromFile('/../../data/pumpConfig.json');
        }
        return json;
    }

    function savePumpConfiguration(config) {
        vm.jsonfileservice.saveJsonToFile('/../../data/pumpConfig_custom.json', config);
    }

};

module.exports = LocalDataService;