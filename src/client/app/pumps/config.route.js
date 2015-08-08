(function () {
    'use strict';

    angular
        .module('app.pumps')
        .run(appRun);

    // appRun.$inject = ['routehelper'];

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/pumps',
                config: {
                    templateUrl: 'app/pumps/pumps.html',
                    controller: 'Pumps',
                    controllerAs: 'vm',
                    title: 'pumps',
                    settings: {
                        nav: 3,
                        content: '<i class="fa"></i> Configuration'
                    }
                }
            }
        ];
    }
})();
