describe('Midway: templates', function() {
    it('should load the template for the saloon view properly',
        function(done) {
            var tester = ngMidwayTester('app');
            tester.visit('/saloon', function() {
                var current = tester.inject('$route').current;
                var controller = current.controller;
                var template = current.templateUrl;
                expect(template).to.match(/saloon\/saloon\.html/);
                tester.destroy();
                done();
            });
        });

    it('should load the template for the cocktails view properly',
        function(done) {
            var tester = ngMidwayTester('app');
            tester.visit('/', function() {
                var current = tester.inject('$route').current;
                var controller = current.controller;
                var template = current.templateUrl;
                expect(template).to.match(/cocktails\/cocktails\.html/);
                tester.destroy();
                done();
            });
        });
});