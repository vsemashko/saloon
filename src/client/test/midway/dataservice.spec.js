describe('Midway: dataservice requests', function () {
    var dataservice;
    var tester;

    beforeEach(function () {
        if (tester) {
            tester.destroy();
        }
        tester = ngMidwayTester('app');
    });

    beforeEach(function () {
        dataservice = tester.inject('dataservice');
        expect(dataservice).not.to.equal(null);
    });

    describe('getCocktails function', function () {
        it('should return 2 Cocktails', function (done) {
            dataservice.getCocktails().then(function (data) {
                expect(data).not.to.equal(null);
                expect(data.length).to.equal(2);
                done();
            });
            // $rootScope.$apply();
        });

        it('should contain Белый Русский', function (done) {
            dataservice.getCocktails().then(function (data) {
                expect(data).not.to.equal(null);
                var hasWhiteRussian = data.some(function isPrime(element, index, array) {
                    return element.name.indexOf('Белый Русский') >= 0;
                });
                expect(hasWhiteRussian).to.be.true;
                done();
            });
            // $rootScope.$apply();
        });
    });

});