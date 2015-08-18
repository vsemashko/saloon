(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('dataservice', dataservice);

    dataservice.$inject = ['$resource', '$q', 'exception'];

    /* @ngInject */
    function dataservice($resource, $q, exception) {
        var isPrimed = false;
        var primePromise;

        var service = {
            getCocktails: getCocktails,
            getIngredients: getIngredients,
            getLiquids: getLiquids,
            prepareCocktail: prepareCocktail,
            getPumpConfig: getPumpConfig,
            savePumpConfig: savePumpConfig,
            saveLiquidsConfig: saveLiquidsConfig,
            ready: ready
        };

        return service;

        function getCocktails() {
            var Cocktails = $resource('/api/cocktails', {});
            return Cocktails.query({}).$promise.then(getCocktailsComplete).catch(handleException);
            function getCocktailsComplete(data, status, headers, config) {
                return data[0].data;
            }
        }

        function getIngredients() {
            var Ingredients = $resource('/api/ingredients', {});
            return Ingredients.query({}).$promise.then(getIngredientsComplete).catch(handleException);
            function getIngredientsComplete(data, status, headers, config) {
                return data[0].data;
            }
        }

        function getLiquids() {
            return getLiquidsResource().query({}).$promise.then(getLiquidsComplete).catch(handleException);
            function getLiquidsComplete(data, status, headers, config) {
                return data[0].data;
            }
        }

        function prepareCocktail(cocktail) {
            return getPourResource().pour(cocktail.bar_ingredients).$promise.then(pourCocktailComplete).catch(handleException);
            function pourCocktailComplete(data) {
                return data;
            }
        }

        function getPumpConfig() {
            return getPumpResource().get().$promise.then(getPumpsConfigComplete).catch(handleException);
            function getPumpsConfigComplete(data, status, headers, config) {
                return data[0].data;
            }
        }

        function savePumpConfig(config) {
            var storedConfig = [{
                'data': config
            }];
            return getPumpResource().save(storedConfig).$promise.then(getPumpsConfigComplete).catch(handleException);
            function getPumpsConfigComplete(data, status, headers, config) {
                return data[0].data;
            }
        }

        function saveLiquidsConfig(config) {
            _.each(config, function(item){
                delete item.isNew;
            });
            var storedConfig = [{
                'data': config
            }];
            return getLiquidsResource().save(storedConfig).$promise.then(getLiquidsConfigComplete).catch(handleException);
            function getLiquidsConfigComplete(data, status, headers, config) {
                return data[0].data;
            }
        }

        function getLiquidsResource() {
            var actions = {
                get: {
                    url: '/api/liquids',
                    method: "GET",
                    isArray: true
                },
                save: {
                    url: '/api/liquids',
                    method: "POST",
                    data: {
                        config: '@config'
                    },
                    isArray: true
                }
            };
            return $resource('/api/liquids', {}, actions);
        }

        function getPumpResource() {
            var actions = {
                get: {
                    url: '/api/pump-config',
                    method: "GET",
                    isArray: true
                },
                save: {
                    url: '/api/pump-config',
                    method: "POST",
                    data: {
                        config: '@config'
                    },
                    isArray: true
                }
            };
            return $resource('/api/pour', {}, actions);
        }

        function getPourResource() {
            var actions = {
                pour: {
                    url: '/api/pour',
                    method: "POST",
                    data: {
                        steps: "@steps"
                    }
                }
            };
            return $resource('/api/pour', {}, actions);
        }

        function prime() {
            // This function can only be called once.
            if (primePromise) {
                return primePromise;
            }

            primePromise = $q.when(true).then(success);
            return primePromise;

            function success() {
                isPrimed = true;
            }
        }

        function ready(nextPromises) {
            var readyPromise = primePromise || prime();

            return readyPromise
                .then(function () {
                    return $q.all(nextPromises);
                })
                .catch(exception.catcher('"ready" function failed'));
        }

        function handleException(message) {
            exception.catcher('XHR Failed for data service')(message);
        }

    }
})();
