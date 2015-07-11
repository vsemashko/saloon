/* jshint -W117, -W030 */
describe('app.cocktails', function () {
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

        controller = $controller('Cocktails');
        $rootScope.$apply();
    });

    describe('Cocktails controller', function () {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function () {
            it('should have title of Cocktails recipes', function () {
                expect(controller.title).to.equal('Cocktails recipes');
            });

            it('should have at least 1 cocktail', function () {
                expect(controller.cocktails).to.have.length.above(0);
            });
        });
    });

    specHelper.verifyNoOutstandingHttpRequests();
});