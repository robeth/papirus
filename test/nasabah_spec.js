var setup = require('./setup');
var driver = setup.driver;
var migration = setup.migration;

describe('Nasabah Scenarios', function(){
  this.timeout(20000);

  before(function(done){
    migration.down()
      .then(function(){
        return migration.up();
      })
      .then(function(){
        return driver.init().pause(5000)
          .then(function(){
            done();
          });
      });
  });

  after(function(done){
    driver.end(done);
  });

  beforeEach(function(done){
    migration.downDummy()
      .then(function(){
        return migration.upDummy();
      })
      .then(function(){
        // Select Form > Nasabah
        driver
          .refresh()
          .pause(1000)
          .click('//div[@id="container"]/div/div/aside/section/ul/li[3]/a')
          .pause(1000)
          .click('//*[@id="container"]/div/div/aside/section/ul/li[3]/ul/li[6]/a')
          .pause(1000)
          .then(function(result){
            done();
          });
      });
  });

  it('should have title', function(done){
    driver
      .setValue('//*[@id="container"]/div/div/div/section[2]/div/div[2]/form/div[2]/div[1]/div[3]/div/input','hello')
      .pause(2000)
      .then(function(){
        done();
      });
  });

  it('should have #container', function(){
    2;
  });
});
