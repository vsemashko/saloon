var LocalDataService = function () {

    var vm = this;
    vm.jsonfileservice = require('./utils/jsonfileservice')();
    vm.getCocktails = getCocktails;
    vm.getLiquids = getLiquids;
    vm.getPumpConfiguration = getPumpConfiguration;
    vm.savePumpConfiguration = savePumpConfiguration;
    vm.saveLiquidsConfiguration = saveLiquidsConfiguration;
    vm.saveCocktailsConfiguration = saveCocktailsConfiguration;
    vm.getIngredients = getIngredients;

    //////////////////

    function getCocktails() {
        return getFileContents('cocktails');
    }

    function getIngredients() {
        return getFileContents('ingredients');
    }

    function getLiquids() {
        return getFileContents('liquids');
    }

    function getPumpConfiguration() {
        return getFileContents('pumpConfig');
    }

    function savePumpConfiguration(config) {
        var storedConfig = [{
            'data': config
        }];
        vm.jsonfileservice.saveJsonToFile('/../../data/pumpConfig_custom.json', storedConfig);
    }

    function saveLiquidsConfiguration(config) {
        vm.jsonfileservice.saveJsonToFile('/../../data/liquids_custom.json', config);
    }

    function saveCocktailsConfiguration(config) {
        vm.jsonfileservice.saveJsonToFile('/../../data/cocktails_custom.json', config);
    }

    function getFileContents(fileName) {
        var json = vm.jsonfileservice.getJsonFromFile('/../../data/' + fileName + '_custom.json');
        if (!json) {
            json = vm.jsonfileservice.getJsonFromFile('/../../data/' + fileName + '.json');
        }
        return json;
    }

};

module.exports = LocalDataService;