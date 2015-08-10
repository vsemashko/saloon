(function () {
    'use strict';

    angular
        .module('app.layout')
        .controller('Shell', Shell);

    Shell.$inject = ['$rootScope', 'config', 'logger', 'dataservice'];

    function Shell($rootScope, config, logger, dataservice) {
        /*jshint validthis: true */
        var vm = this;

        vm.title = config.appTitle;
        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.showSplash = true;
        vm.hideSplash = hideSplash;

        $rootScope.safeApply = function(fn) {
            var phase = this.$root.$$phase;
            if(phase == '$apply' || phase == '$digest') {
                if(fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };

        activate();

        function activate() {
            
            logger.success(config.appTitle + ' loaded!', null);
            dataservice.ready().then(function () {
                var commands = [];
                commands = {
                    'поехали': hideSplash
                };
                // Add our commands to annyang
                annyang.addCommands(commands);
                // Start listening.
                annyang.debug(true);
                annyang.setLanguage("ru");
                annyang.start();
            });
        }

        function hideSplash() {
            $rootScope.safeApply(function() {
                vm.showSplash = false;
                annyang.pause();
            });
        }
    }
})();
