(function () {
    'use strict';

    angular
        .module('app.layout')
        .controller('Shell', Shell);

    Shell.$inject = ['$timeout', 'config', 'logger', 'dataservice'];

    function Shell($timeout, config, logger, dataservice) {
        /*jshint validthis: true */
        var vm = this;

        vm.title = config.appTitle;
        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.showSplash = true;

        activate();

        function activate() {
            logger.success(config.appTitle + ' loaded!', null);
            dataservice.ready().then(function () {
                hideSplash();
            });
        }

        function hideSplash() {
            vm.showSplash = false;
        }
    }
})();
