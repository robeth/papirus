var setup = require('./setup');
var expect = require('chai').expect;
var driver = setup.driver;
var migration = setup.migration;
var Models = require('../build/models/');

describe('Vendor Scenarios', function(){
  this.timeout(20000);

  before(function(done){
    migration.down()
      .then(function(){
        return migration.up();
      })
      .then(function(){
        return driver.init().pause(1000)
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
        driver
          .refresh()
          .pause(1000)
          .then(function(){
            done();
          });
      });
  });

  describe("Add Vendor", function(done){

    beforeEach(function(done){
      driver
        .click('#menu-form')
        .pause(1000)
        .click('#menu-form-vendor')
        .pause(1000)
        .then(function(){
          done();
        });
    });

    it('should save new vendor on valid data', function(done){
      driver
        .setValue('#nama', 'Sakata Gintoki')
        .setValue('#alamat', 'Edo')
        .setValue('#telepon','+6281-322-7700')
        .setValue('#email', 'silver.samurai@edo.jp')
        .click('//*[contains(text(), "Simpan")]')
        .pause(1000)
        .getText('//body')
        .then(function(pageText){
          expect(pageText).to.contain('Sukses!');
          expect(pageText).to.include('Data vendor berhasil dibuat!');
          return Models.Vendor.findAll({
            where: {
              alamat: 'Edo'
            }
          });
        })
        .then(function(results){
          expect(results).to.have.length(1);

          var result = results[0];
          expect(result.nama).to.equal('Sakata Gintoki');
          expect(result.alamat).to.equal('Edo');
          expect(result.telepon).to.equal('+6281-322-7700');
          expect(result.email).to.equal('silver.samurai@edo.jp');
          expect(result.tanggal_daftar).to.exist;

          done();
        })
        .catch(function(error){
          done(error);
        });
    });

    it('should show error on invalid data', function(done){
      driver
        .click('//*[contains(text(), "Simpan")]')
        .pause(1000)
        .getText('//body')
        .then(function(pageText){
          expect(pageText).to.contain('Wajib diisi');
          return Models.Vendor.findAll({
            where: {
              alamat: 'Edo'
            }
          });
        })
        .then(function(results){
          expect(results).to.have.length(0);
          done();
        })
        .catch(function(error){
          done(error);
        });
    });

  });

  describe('Edit Vendor', function(done){
    beforeEach(function(done){
      driver
        .click('#menu-data')
        .pause(1000)
        .click('#menu-data-vendor')
        .pause(1000)
        .click('//td//a/span[contains(text(), "V1")]')
        .pause(1000)
        .click('//*[contains(text(), "Edit")]')
        .pause(1000)
        .then(function(){
          done();
        })
        .catch(function(error){
          done(error);
        });
    });

    it('should update vendor on valid data', function(done){
      driver
      .setValue('#nama', 'Sakata Gintoki')
      .setValue('#alamat', 'Edo')
      .setValue('#telepon','+6281-322-7700')
      .setValue('#email', 'silver.samurai@edo.jp')
      .click('//*[contains(text(), "Simpan")]')
      .pause(1000)
      .getText('//body')
      .then(function(pageText){
        expect(pageText).to.contain('Sukses!');
        expect(pageText).to.include('Data vendor berhasil diubah!');
        return Models.Vendor.findById(1);
      })
      .then(function(result){
        expect(result.nama).to.equal('Sakata Gintoki');
        expect(result.alamat).to.equal('Edo');
        expect(result.telepon).to.equal('+6281-322-7700');
        expect(result.email).to.equal('silver.samurai@edo.jp');
        expect(result.tanggal_daftar).to.exist;

        done();
      })
      .catch(function(error){
        done(error);
      });
    });

    it('should not update vendor on cancel', function(done){
      driver
      .setValue('#nama', 'Sakata Gintoki')
      .setValue('#alamat', 'Edo')
      .setValue('#telepon','+6281-322-7700')
      .setValue('#email', 'silver.samurai@edo.jp')
      .click('//*[contains(text(), "Batal")]')
      .pause(1000)
      .getText('//body')
      .then(function(pageText){
        expect(pageText).to.not.contain('Sukses!');
        return Models.Vendor.findById(1);
      })
      .then(function(result){
        expect(result.nama).to.equal('PT. Daur Ulang');
        expect(result.alamat).to.equal('Manukan 1');
        expect(result.telepon).to.equal('031-5522001');
        expect(result.email).to.equal('daurulang@gmail.com');
        expect(result.tanggal_daftar).to.exist;

        done();
      })
      .catch(function(error){
        done(error);
      });
    });

    it('should not update vendor on invalid data', function(done){
      driver
      .setValue('#nama', ' ')
      .setValue('#alamat', ' ')
      .setValue('#telepon','+6281-322-7700')
      .setValue('#email', 'silver.samurai@edo.jp')
      .click('//*[contains(text(), "Simpan")]')
      .pause(1000)
      .getText('//body')
      .then(function(pageText){
        expect(pageText).to.contain('Wajib diisi');
        return Models.Vendor.findById(1);
      })
      .then(function(result){
        expect(result.nama).to.equal('PT. Daur Ulang');
        expect(result.alamat).to.equal('Manukan 1');
        expect(result.telepon).to.equal('031-5522001');
        expect(result.email).to.equal('daurulang@gmail.com');
        expect(result.tanggal_daftar).to.exist;

        done();
      })
      .catch(function(error){
        done(error);
      });
    });

  });

});
