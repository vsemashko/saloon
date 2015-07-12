module.exports = function (app) {
    var jsonfileservice = require('./utils/jsonfileservice')(),
        raspberry = require('../app.js').raspberry;

    app.get('/api/cocktails', getCocktails);
    app.get('/pour', pourLiquid);

    function getCocktails(req, res, next) {
        var json = jsonfileservice.getJsonFromFile('/../../data/coctails.json');
        res.send(json);
    }

    function pourLiquid(req, res, next) {
        raspberry.pour(1, 100).then(function () {
            raspberry.pour(2, 100).then(function () {
                res.send({result: 'Liquid is ready!'});
            });
        });
    }
};