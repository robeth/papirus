var webdriverio = require('webdriverio');
var migration = require('../build/migration');

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

var driver = webdriverio.remote(options);
driver.addCommand('clickAnOption', function(htmlId, text){
  return this
    .click('#' + htmlId + ' div.Select-control')
    .click('//*[@id="' + htmlId + '"]//div[@class="Select-menu-outer"]//div[contains(text(),"' + text + '")]')
    .pause(1000);
})

module.exports = {
  driver: driver,
  migration: migration
};
