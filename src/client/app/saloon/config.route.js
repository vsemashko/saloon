(function () {
    'use strict';

    angular
        .module('app.saloon')
        .run(appRun);

    appRun.$inject = ['routehelper'];

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/saloon',
                config: {
                    templateUrl: 'app/saloon/saloon.html',
                    controller: 'Saloon',
                    controllerAs: 'vm',
                    title: 'saloon',
                    settings: {
                        nav: 2,
                        content: '<i class="fa"></i> Saloon'
                    }
                }
            }
        ];
    }
})();
