var setup = require('./setup');
var expect = require('chai').expect;
var driver = setup.driver;
var migration = setup.migration;
var Models = require('../build/models/');

describe.only('Kategori Scenarios', function(){
  this.timeout(30000);

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

  describe("Add Kategori", function(done){

    beforeEach(function(done){
      driver
        .click('#menu-form')
        .pause(1000)
        .click('#menu-form-barang')
        .pause(1000)
        .then(function(){
          done();
        });
    });

    it('should save new kategori on valid data', function(done){
      driver
        .setValue('#kategori-nama', 'Wooden Katana')
        .setValue('#kategori-kode', 'SW-01')
        .clickAnOption('kategori-report-kategori-id', 'Plastik')
        .setValue('#kategori-deskripsi','Dummy sword for samurai training')
        .setValue('#kategori-satuan', 'Slash')
        .setValue('#kategori-stabil', '210000')
        .setValue('#kategori-fluktuatif', '205000')
        .click('//*[contains(text(), "Simpan")]')
        .pause(1000)
        .getText('//body')
        .then(function(pageText){
          expect(pageText).to.contain('Sukses!');
          expect(pageText).to.include('Data kategori barang berhasil dibuat!');
          return Models.Kategori.findAll({
            where: {
              nama: 'Wooden Katana'
            }
          });
        })
        .then(function(results){
          expect(results).to.have.length(1);

          var result = results[0];
          expect(result.kode).to.equal('SW-01');
          expect(result.nama).to.equal('Wooden Katana');
          expect(result.deskripsi).to.equal('Dummy sword for samurai training');
          expect(result.satuan).to.equal('Slash');
          expect(result.stabil).to.equal(210000);
          expect(result.fluktuatif).to.equal(205000);
          expect(result.report_kategori_id).to.equal(4);

          done();
        })
        .catch(function(error){
          done(error);
        });
    });

    it('should show error on invalid data', function(done){
      driver
        .setValue('#kategori-nama', 'Excalibur')
        .setValue('#kategori-kode', ' ')
        .clickAnOption('kategori-report-kategori-id', 'Logam')
        .setValue('#kategori-deskripsi','Legendary sword')
        .setValue('#kategori-satuan', 'Slash')
        .setValue('#kategori-stabil', '999999')
        .setValue('#kategori-fluktuatif', '999999')
        .click('//*[contains(text(), "Simpan")]')
        .pause(1000)
        .getText('//body')
        .then(function(pageText){
          expect(pageText).to.contain('Wajib diisi');
          return Models.Kategori.findAll({
            where: {
              nama: 'Excalibur'
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

  describe('Edit Kategori', function(done){
    beforeEach(function(done){
      driver
        .click('#menu-data')
        .pause(1000)
        .click('#menu-data-barang')
        .pause(1000)
        .waitForExist('//td//a/code', 20000)
        .click('//td//a/code[contains(text(), "B1")]')
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

    it('should update kategori on valid data', function(done){
      driver
      .setValue('#kategori-nama', 'Wooden Katana')
      .setValue('#kategori-kode', 'SW-01')
      .clickAnOption('kategori-report-kategori-id', 'Plastik')
      .setValue('#kategori-deskripsi','Dummy sword for samurai training')
      .setValue('#kategori-satuan', 'Slash')
      .setValue('#kategori-stabil', '210000')
      .setValue('#kategori-fluktuatif', '205000')
      .click('//*[contains(text(), "Simpan")]')
      .pause(1000)
      .getText('//body')
      .then(function(pageText){
        expect(pageText).to.contain('Sukses!');
        expect(pageText).to.include('Data kategori barang berhasil diubah!');
        return Models.Kategori.findById(6);
      })
      .then(function(result){
        expect(result.kode).to.equal('SW-01');
        expect(result.nama).to.equal('Wooden Katana');
        expect(result.deskripsi).to.equal('Dummy sword for samurai training');
        expect(result.satuan).to.equal('Slash');
        expect(result.stabil).to.equal(210000);
        expect(result.fluktuatif).to.equal(205000);
        expect(result.report_kategori_id).to.equal(4);

        done();
      })
      .catch(function(error){
        done(error);
      });
    });

    it('should not update kategori on cancel', function(done){
      driver
      .setValue('#kategori-nama', 'Wooden Katana')
      .setValue('#kategori-kode', 'SW-01')
      .clickAnOption('kategori-report-kategori-id', 'Plastik')
      .setValue('#kategori-deskripsi','Dummy sword for samurai training')
      .setValue('#kategori-satuan', 'Slash')
      .setValue('#kategori-stabil', '210000')
      .setValue('#kategori-fluktuatif', '205000')
      .click('//*[contains(text(), "Batal")]')
      .pause(1000)
      .getText('//body')
      .then(function(pageText){
        expect(pageText).to.not.contain('Sukses!');
        return Models.Kategori.findById(6);
      })
      .then(function(result){
        expect(result.kode).to.equal('B1');
        expect(result.nama).to.equal('Super');
        expect(result.deskripsi).to.equal('Tebal, beton neser ');
        expect(result.satuan).to.equal('Kg ');
        expect(result.stabil).to.equal(2500.00);
        expect(result.fluktuatif).to.equal(2500.00);
        expect(result.report_kategori_id).to.equal(1);

        done();
      })
      .catch(function(error){
        done(error);
      });
    });

    it('should not update kategori on invalid data', function(done){
      driver
      .setValue('#kategori-nama', ' ')
      .setValue('#kategori-kode', ' ')
      .clickAnOption('kategori-report-kategori-id', 'Plastik')
      .setValue('#kategori-deskripsi','Dummy sword for samurai training')
      .setValue('#kategori-satuan', 'Slash')
      .setValue('#kategori-stabil', '210000')
      .setValue('#kategori-fluktuatif', '205000')
      .click('//*[contains(text(), "Simpan")]')
      .pause(1000)
      .getText('//body')
      .then(function(pageText){
        expect(pageText).to.contain('Wajib diisi');
        return Models.Kategori.findById(6);
      })
      .then(function(result){
        expect(result.kode).to.equal('B1');
        expect(result.nama).to.equal('Super');
        expect(result.deskripsi).to.equal('Tebal, beton neser ');
        expect(result.satuan).to.equal('Kg ');
        expect(result.stabil).to.equal(2500.00);
        expect(result.fluktuatif).to.equal(2500.00);
        expect(result.report_kategori_id).to.equal(1);

        done();
      })
      .catch(function(error){
        done(error);
      });
    });

  });

});
