(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('dataservice', dataservice);

    /* @ngInject */
    function dataservice($resource, $q, exception) {
        var isPrimed = false;
        var primePromise;

        var service = {
            getCocktails: getCocktails,
            prepareCocktail: prepareCocktail,
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

        function prepareCocktail() {
            return $resource('/pour', {}).get({}).$promise.then(pourCocktailComplete).catch(handleException);
            function pourCocktailComplete(data) {
                return data;
            }
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
                .then(function() { return $q.all(nextPromises); })
                .catch(exception.catcher('"ready" function failed'));
        }

        function handleException(message) {
            exception.catcher('XHR Failed for data service')(message);
        }

    }
})();
