(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('dataservice', dataservice);

    /* @ngInject */
    function dataservice($http, $location, $q, exception, logger) {
        var isPrimed = false;
        var primePromise;

        var service = {
            getCocktails: getCocktails,
            ready: ready
        };

        return service;

        function getCocktails() {
            return $http.get('/api/cocktails')
                .then(getCocktailsComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getCocktails')(message);
                    $location.url('/');
                });

            function getCocktailsComplete(data, status, headers, config) {
                return data.data[0].data;
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

    }
})();
