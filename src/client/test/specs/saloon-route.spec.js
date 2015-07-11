/* jshint -W117, -W030 */
describe('saloon', function () {
    describe('route', function () {
        var controller;

        beforeEach(function () {
            module('app', specHelper.fakeLogger);
            specHelper.injector(function ($httpBackend, $location, $rootScope, $route) {
            });
            $httpBackend.expectGET('app/saloon/saloon.html').respond(200);
        });

        it('should map /saloon route to saloon View template', function () {
            expect($route.routes['/saloon'].templateUrl).
                to.equal('app/saloon/saloon.html');
        });

        it('should route / to the cocktails View', function () {
            expect($route.routes['/'].templateUrl).to.equal('app/cocktails/cocktails.html');
        });
    });
});