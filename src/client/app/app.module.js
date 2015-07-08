(function() {
    'use strict';

    angular.module('app', [
        'app.core',
        'app.widgets',

        /*
         * Feature areas
         */
        'app.cocktails',
        'app.saloon',
        'app.layout'
    ]);

})();