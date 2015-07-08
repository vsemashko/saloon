module.exports = function (app) {
    var jsonfileservice = require('./utils/jsonfileservice')();

    app.get('/api/cocktails', getCocktails);

    function getCocktails(req, res, next) {
        var json = jsonfileservice.getJsonFromFile('/../../data/coctails.json');
        res.send(json);
    }
};