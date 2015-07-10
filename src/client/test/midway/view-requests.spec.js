describe('Midway: view requests', function() {
    var tester;
    beforeEach(function() {
        if (tester) {
            tester.destroy();
        }
        tester = ngMidwayTester('app');
    });

    beforeEach(function() {
        module('app', specHelper.fakeLogger);
    });

    it('should goto the cocktails by default', function(done) {
        tester.visit('/', function() {
            expect(tester.viewElement().html()).to.contain('id="dashboard-view"');
            done();
        });
    });

    it('should have a working saloon request', function(done) {
        tester.visit('/saloon', function() {
            expect(tester.viewElement().html()).to.contain('Which cocktail you want to prepare?');
            done();
        });
    });
});