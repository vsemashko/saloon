(function () {
    'use strict';

    angular
        .module('app.cocktails')
        .run(appRun);

    // appRun.$inject = ['routehelper'];

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/',
                config: {
                    templateUrl: 'app/cocktails/cocktails.html',
                    controller: 'Cocktails',
                    controllerAs: 'vm',
                    title: 'cocktails',
                    settings: {
                        nav: 1,
                        content: '<i class="fa"></i> Cocktails'
                    }
                }
            }
        ];
    }
})();
