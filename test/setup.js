var webdriverio = require('webdriverio');
var Migration = require('../build/migration');

var options = {
    host: "localhost",
    port: 9515,
    desiredCapabilities: {
            browserName: 'chrome',
            chromeOptions: {
              binary: __dirname + '/../node_modules/electron-prebuilt/dist/electron',
              args:  ['app=' + __dirname + '/../build']
            },
        }
}

var databaseParams = {
  host: 'localhost',
  port: '3306',
  name: 'papirus_test',
  username: 'root',
  password: 'root'
}

module.exports = {
  driver: webdriverio.remote(options),
  migration: new Migration(databaseParams)
};
