/* jshint -W117, -W030 */
describe('dataservice', function () {
    var scope;
    var mocks = {};

    beforeEach(function () {
        module('app', function ($provide) {
            specHelper.fakeRouteProvider($provide);
            specHelper.fakeLogger($provide);
        });
        specHelper.injector(function ($httpBackend, $rootScope, dataservice) {
        });

        mocks.cocktailsData = [{
            data: {results: mockData.getMockCocktails()}
        }];
    });

    it('should be registered', function () {
        expect(dataservice).not.to.equal(null);
    });

    describe('getCocktails function', function () {
        it('should exist', function () {
            expect(dataservice.getCocktails).not.to.equal(null);
        });

        it('should return 2 Cocktails', function (done) {
            $httpBackend.when('GET', '/api/cocktails').respond(200, mocks.cocktailsData);
            dataservice.getCocktails().then(function (data) {
                expect(data.results.length).to.equal(2);
                done();
            });
            $rootScope.$apply();
            $httpBackend.flush();
        });

        it('should contain Белый Русский', function (done) {
            $httpBackend.when('GET', '/api/cocktails').respond(200, mocks.cocktailsData);
            dataservice.getCocktails().then(function (data) {
                var hasWhiteRussian = data.results.some(function isPrime(element, index, array) {
                    return element.name.indexOf('Белый Русский') >= 0;
                });
                expect(hasWhiteRussian).to.be.true;
                done();
            });
            $rootScope.$apply();
            $httpBackend.flush();
        });
    });

    describe('ready function', function () {
        it('should exist', function () {
            expect(dataservice.ready).not.to.equal(null);
        });

        it('should return a resolved promise', function (done) {
            dataservice.ready()
                .then(function (data) {
                    expect(true).to.be.true;
                    done();
                }, function (data) {
                    expect('promise rejected').to.be.true;
                    done();
                });
            $rootScope.$apply();
        });
    });

    specHelper.verifyNoOutstandingHttpRequests();
});