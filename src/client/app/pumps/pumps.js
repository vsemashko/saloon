(function () {
    'use strict';

    angular
        .module('app.pumps')
        .controller('Pumps', Pumps);

    Pumps.$inject = ['$q', 'dataservice', 'logger'];

    function Pumps($q, dataservice, logger) {

        /*jshint validthis: true */
        var vm = this;
        vm.init = init;
        vm.pumps = [];
        vm.liquids = [];
        vm.cocktails = [];

        vm.savePumps = savePumps;
        vm.saveLiquids = saveLiquids;
        vm.saveCocktail = saveCocktail;
        vm.addNewLiquid = addNewLiquid;
        vm.addNewCocktail = addNewCocktail;
        vm.selectCocktail = selectCocktail;
        vm.changeCocktailIngredient = changeCocktailIngredient;
        vm.addNewIngredient = addNewIngredient;
        vm.removeIngredient = removeIngredient;

        vm.clearPump = clearPump;
        vm.title = 'Pumps config';

        vm.imageOptions = [
            {name: 'Long glass', value: 'content/cocktails/collins-glass.png'},
            {name: 'Shot glass', value: 'content/cocktails/shot-glass.png'},
            {name: 'Rock glass', value: 'content/cocktails/rock-glass.png'}
        ];

        activate();

        function init(pump) {
            var liquidIndex = _.findIndex(vm.liquids, 'id', pump.liquid.id);
            if (liquidIndex >= 0) {
                pump.liquid = vm.liquids[liquidIndex];
            } else {
                vm.liquids.unshift(pump.liquid);
            }
            vm.selectedIngredient = pump.liquid;
        }

        function activate() {
            var promises = [getLiquids(), getPumps(), getCocktails()];
            return $q.all(promises);
        }

        function getPumps() {
            return dataservice.getPumpConfig().then(function (data) {
                vm.pumps = data;
                return vm.pumps;
            });
        }

        function savePumps() {
            return dataservice.savePumpConfig(vm.pumps).then(function (data) {
                logger.success('Pumps config saved');
            });
        }

        function clearPump(pump) {
            return dataservice.cleanupPump(pump).then(function (data) {
                logger.success('Pump cleared');
            });
        }

        function saveLiquids() {
            return dataservice.saveLiquidsConfig(vm.liquids).then(function (data) {
                logger.success('Liquids config saved');
            });
        }

        function saveCocktail() {
            return dataservice.saveCocktailsConfig(vm.cocktails).then(function (data) {
                logger.success('Cocktails config saved');
            });
        }

        function addNewLiquid() {
            var newLiquid = {isNew: true, name: "Default", id: guid()};
            vm.liquids.push(newLiquid);
            vm.selectedIngredient = newLiquid;
        }

        function addNewCocktail() {
            var newCocktail = {
                isNew: true, name: "New", id: guid(), bar_ingredients: [], ingredients: [],
                image: vm.imageOptions[0].value
            };
            vm.cocktails.push(newCocktail);
            vm.selectedCocktail = newCocktail;
        }

        function selectCocktail(coctail) {
            vm.selectedCocktail = coctail;
        }

        function changeCocktailIngredient(ingredient, liquid) {
            ingredient.id = liquid.id;
            ingredient.name = liquid.name;
        }

        function getNextStep() {
            var result = 1;
            if (!_.isEmpty(vm.selectedCocktail.bar_ingredients)) {
                result = vm.selectedCocktail.bar_ingredients[vm.selectedCocktail.bar_ingredients.length - 1].step + 1
            }
            return result;
        }

        function addNewIngredient() {
            var nextStep = getNextStep();
            var defaultLiquid = vm.liquids[0];
            var newIngredient = {
                step: nextStep,
                amount: 50,
                id: defaultLiquid.id,
                name: defaultLiquid.name
            };
            vm.selectedCocktail.bar_ingredients.push(newIngredient);
        }

        function removeIngredient(ingredient) {
            _.remove(vm.selectedCocktail.bar_ingredients, {id: ingredient.id});
        }

        function getLiquids() {
            return dataservice.getLiquids().then(function (data) {
                vm.liquids = data;
                return vm.liquids;
            });
        }

        function getCocktails() {
            return dataservice.getCocktails().then(function (data) {
                vm.cocktails = data;
                return vm.cocktails;
            });
        }

        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }

            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }
    }
})();
