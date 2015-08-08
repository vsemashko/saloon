module.exports = function () {
    var service = {
        getJsonFromFile: getJsonFromFile,
        saveJsonToFile: saveJsonToFile
    };
    return service;

    function getJsonFromFile(file) {
        var fs = require('fs');
        var json = getConfig(file);
        return json;

        function readJsonFileSync(filepath, encoding) {
            encoding = getEncoding(encoding);
            try {
                var file = fs.readFileSync(filepath, encoding);
                return JSON.parse(file);
            }
            catch (err) {
                console.log('Can\'t read requested file = %s. Error message = %s', filepath, err);
                return null;
            }
        }

        function getConfig(file) {
            var filepath = __dirname + file;
            return readJsonFileSync(filepath);
        }

    }

    function saveJsonToFile(file, data) {
        var fs = require('fs');
        var filepath = __dirname + file;
        writeJsonFileSync(filepath, data);

        function writeJsonFileSync(filepath, data, encoding) {
            encoding = getEncoding(encoding);
            var json = JSON.stringify(data);
            fs.writeFileSync(filepath, json, encoding);
        }
    }

    function getEncoding(encoding) {
        if (typeof (encoding) === 'undefined') {
            encoding = 'utf8';
        }
        return encoding;
    }
};
