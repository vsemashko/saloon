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
        raspberry.pour().then(function () {
            res.send({result: 'Liquid is ready!'});
        });
    }
};