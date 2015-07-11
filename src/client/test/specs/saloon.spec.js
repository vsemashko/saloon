/* jshint -W117, -W030 */
describe('app.saloon', function () {
    var controller;

    beforeEach(function () {
        module('app', function ($provide) {
            specHelper.fakeRouteProvider($provide);
            specHelper.fakeLogger($provide);
        });
        specHelper.injector(function ($controller, $q, $rootScope, dataservice) {
        });
    });

    beforeEach(function () {
        sinon.stub(dataservice, 'getCocktails', function () {
            var deferred = $q.defer();
            deferred.resolve(mockData.getMockCocktails());
            return deferred.promise;
        });

        sinon.stub(dataservice, 'ready', function () {
            var deferred = $q.defer();
            deferred.resolve({test: 123});
            return deferred.promise;
        });

        controller = $controller('Saloon');
        $rootScope.$apply();
    });

    describe('Saloon controller', function () {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function () {
            it('should have title of Saloon', function () {
                expect(controller.title).to.equal('Saloon');
            });

            it('should have 2 Cocktails', function () {
                expect(controller.cocktails).to.have.length(2);
            });
        });
    });

    specHelper.verifyNoOutstandingHttpRequests();
});