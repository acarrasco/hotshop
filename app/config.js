var yaml = require('js-yaml');
var fs = require('fs');

try {
    module.exports = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'));
} catch (e) {
    console.log("------------------\nError parsing config.yml data.\n------------------\n");
    throw e;
}
