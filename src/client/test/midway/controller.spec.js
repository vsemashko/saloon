//http://www.yearofmoo.com/2013/01/full-spectrum-testing-with-angularjs-and-karma.html
//https://github.com/yearofmoo-articles/AngularJS-Testing-Article
describe('Midway: controllers and routes', function () {
    var tester;
    beforeEach(function () {
        if (tester) {
            tester.destroy();
        }
        tester = ngMidwayTester('app');
    });

    beforeEach(function () {
        module('app', specHelper.fakeLogger);
    });

    it('should load the Saloon controller properly when /saloon route is accessed', function (done) {
        tester.visit('/saloon', function () {
            expect(tester.path()).to.equal('/saloon');
            var current = tester.inject('$route').current;
            var controller = current.controller;
            var scope = current.scope;
            expect(controller).to.equal('Saloon');
            done();
        });
    });

    it('should load the Cocktails controller properly when / route is accessed', function (done) {
        tester.visit('/', function () {
            expect(tester.path()).to.equal('/');
            var current = tester.inject('$route').current;
            var controller = current.controller;
            var scope = current.scope;
            expect(controller).to.equal('Cocktails');
            done();
        });
    });

});