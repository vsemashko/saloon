/*jshint node:true*/
'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var compress = require('compression');
var cors = require('cors');
var errorHandler = require('./routes/utils/errorHandler')();
var favicon = require('serve-favicon');
var logger = require('morgan');
var port = process.env.PORT || 7200;
var https = require('https');
var fs = require('fs');
var privateKey  = fs.readFileSync('src/server/sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('src/server/sslcert/server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
var routes;

var environment = process.env.NODE_ENV;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(compress());            // Compress response data with gzip
app.use(logger('dev'));
app.use(favicon(__dirname + '/favicon.ico'));
app.use(cors());                // enable ALL CORS requests
app.use(errorHandler.init);

var DataService = require('./dataservice/localDataService');
exports.dataService = new DataService();

var Raspberry = initRaspberryModule();
exports.raspberry = new Raspberry();

routes = require('./routes/routes')(app);

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

var source = '';

app.get('/ping', function (req, res, next) {
    console.log(req.body);
    res.send('pong');
});

switch (environment) {
    case 'stage':
    case 'build':
        console.log('** BUILD **');
        console.log('serving from ' + './build/');
        app.use('/', express.static('./build/'));
        break;
    default:
        console.log('** DEV **');
        console.log('serving from ' + './src/client/ and ./');
        app.use('/', express.static('./src/client/'));
        app.use('/', express.static('./'));

        break;
}

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, function () {
    console.log('Express server listening on port ' + port);
    console.log('env = ' + app.get('env') +
        '\n__dirname = ' + __dirname +
        '\nprocess.cwd = ' + process.cwd());
});

function initRaspberryModule() {
    var Raspberry;
    switch (environment) {
        case 'test':
            Raspberry = require('./gpio/raspberryStub');
            break;
        default :
            Raspberry = require('./gpio/raspberry');
    }
    return Raspberry;
}