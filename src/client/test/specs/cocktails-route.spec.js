/* jshint -W117, -W030 */
describe('cocktails', function () {
    describe('route', function () {
        var controller;

        beforeEach(function() {
            module('app', specHelper.fakeLogger);
            specHelper.injector(function($httpBackend, $location, $rootScope, $route) {});            
            $httpBackend.expectGET('app/cocktails/cocktails.html').respond(200);
        });

        it('should map / route to cocktails View template', function () {
            expect($route.routes['/'].templateUrl).
                to.equal('app/cocktails/cocktails.html');
        });

        it('should route / to the cocktails View', function () {
            $location.path('/');
            $rootScope.$digest();
            expect($route.current.templateUrl).to.equal('app/cocktails/cocktails.html');
        });

        it('should route /invalid to the otherwise (cocktails) route', function () {
            $location.path('/invalid');
            $rootScope.$digest();
            expect($route.current.templateUrl).to.equal('app/cocktails/cocktails.html');
        });
    });
});