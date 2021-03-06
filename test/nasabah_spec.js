var setup = require('./setup');
var expect = require('chai').expect;
var driver = setup.driver;
var migration = setup.migration;
var Models = require('../build/models/');

describe('Nasabah Scenarios', function(){
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

  describe("Add Nasabah", function(done){

    beforeEach(function(done){
      driver
        .click('#menu-form')
        .pause(1000)
        .click('#menu-form-nasabah')
        .pause(1000)
        .then(function(){
          done();
        });
    });

    it('should save new nasabah on valid data', function(done){
      driver
        .clickAnOption('nasabah-type', 'Kolektif')
        .setValue('#nasabah-ktp','ktp123')
        .setValue('#nasabah-nama', 'Sakata Gintoki')
        .setValue('#nasabah-alamat', 'Edo')
        .setValue('#nasabah-pj', 'Sinpachi')
        .setValue('#nasabah-no-induk', 'N003')
        .setValue('#nasabah-telepon', '+6281-322-7700')
        .setValue('#nasabah-tanggal-lahir', '1990-12-25')
        .setValue('#nasabah-email', 'silver.samurai@edo.jp')
        .click('//*[contains(text(), "Simpan")]')
        .pause(1000)
        .getText('//body')
        .then(function(pageText){
          expect(pageText).to.contain('Sukses!');
          expect(pageText).to.include('Data nasabah baru berhasil dibuat!');
          return Models.Nasabah.findAll({
            where: {
              ktp: 'ktp123'
            }
          });
        })
        .then(function(results){
          expect(results).to.have.length(1);

          var result = results[0];
          expect(result.jenis).to.equal('kolektif');
          expect(result.ktp).to.equal('ktp123');
          expect(result.nama).to.equal('Sakata Gintoki');
          expect(result.alamat).to.equal('Edo');
          expect(result.nama_pj).to.equal('Sinpachi');
          expect(result.no_induk).to.equal('N003');
          expect(result.telepon).to.equal('+6281-322-7700');
          expect(result.tanggal_lahir).to.equal('1990-12-25');
          expect(result.email).to.equal('silver.samurai@edo.jp');
          expect(result.tanggal_daftar).to.exist;

          done();
        })
        .catch(function(error){
          done(error);
        });
    });

    it('should show error on invalid new nasabah data', function(done){
      driver
        .click('//*[contains(text(), "Simpan")]')
        .pause(1000)
        .getText('//body')
        .then(function(pageText){
          expect(pageText).to.contain('Wajib diisi');
          return Models.Nasabah.findAll({
            where: {
              ktp: 'ktp123'
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

  describe('Edit Nasabah', function(done){
    beforeEach(function(done){
      driver
        .click('#menu-data')
        .pause(1000)
        .click('#menu-data-nasabah')
        .pause(1000)
        .click('#menu-data-nasabah-individu')
        .pause(1000)
        .click('//td//a/span[contains(text(), "1")]')
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

    it('should update nasabah on valid data', function(done){
      driver
      .clickAnOption('nasabah-type', 'Kolektif')
      .setValue('#nasabah-ktp','ktp123')
      .setValue('#nasabah-nama', 'Sakata Gintoki')
      .setValue('#nasabah-alamat', 'Edo')
      .setValue('#nasabah-pj', 'Sinpachi')
      .setValue('#nasabah-no-induk', 'N003')
      .setValue('#nasabah-telepon', '+6281-322-7700')
      .setValue('#nasabah-tanggal-lahir', '1990-12-25')
      .setValue('#nasabah-email', 'silver.samurai@edo.jp')
      .click('//*[contains(text(), "Simpan")]')
      .pause(1000)
      .getText('//body')
      .then(function(pageText){
        expect(pageText).to.contain('Sukses!');
        expect(pageText).to.include('Data nasabah berhasil diubah!');
        return Models.Nasabah.findById(1);
      })
      .then(function(result){
        expect(result.jenis).to.equal('kolektif');
        expect(result.ktp).to.equal('ktp123');
        expect(result.nama).to.equal('Sakata Gintoki');
        expect(result.alamat).to.equal('Edo');
        expect(result.nama_pj).to.equal('Sinpachi');
        expect(result.no_induk).to.equal('N003');
        expect(result.telepon).to.equal('+6281-322-7700');
        expect(result.tanggal_lahir).to.equal('1990-12-25');
        expect(result.email).to.equal('silver.samurai@edo.jp');
        expect(result.tanggal_daftar).to.exist;

        done();
      })
      .catch(function(error){
        done(error);
      });
    });

    it('should not update nasabah on cancel', function(done){
      driver
      .clickAnOption('nasabah-type', 'Kolektif')
      .setValue('#nasabah-ktp','ktp123')
      .setValue('#nasabah-nama', 'Sakata Gintoki')
      .setValue('#nasabah-alamat', 'Edo')
      .setValue('#nasabah-pj', 'Sinpachi')
      .setValue('#nasabah-no-induk', 'N003')
      .setValue('#nasabah-telepon', '+6281-322-7700')
      .setValue('#nasabah-tanggal-lahir', '1990-12-25')
      .setValue('#nasabah-email', 'silver.samurai@edo.jp')
      .click('//*[contains(text(), "Batal")]')
      .pause(1000)
      .getText('//body')
      .then(function(pageText){
        expect(pageText).to.not.contain('Sukses!');
        return Models.Nasabah.findById(1);
      })
      .then(function(result){
        expect(result.jenis).to.equal('individu');
        expect(result.ktp).to.equal('0001');
        expect(result.nama).to.equal('Hiero');
        expect(result.alamat).to.equal('Gubeng 1');
        expect(result.nama_pj).to.equal('Casilas');
        expect(result.no_induk).to.equal('BSM001');
        expect(result.telepon).to.equal('031-5522001');
        expect(result.tanggal_lahir).to.equal('1990-01-01');
        expect(result.email).to.equal('hiero@gmail.com');
        expect(result.tanggal_daftar).to.exist;

        done();
      })
      .catch(function(error){
        done(error);
      });
    });

    it('should not update nasabah on invalid data', function(done){
      driver
      .clickAnOption('nasabah-type', 'Kolektif')
      .setValue('#nasabah-ktp','ktp123')
      .setValue('#nasabah-nama', ' ')
      .setValue('#nasabah-alamat', ' ')
      .setValue('#nasabah-pj', 'Sinpachi')
      .setValue('#nasabah-no-induk', 'N003')
      .setValue('#nasabah-telepon', '+6281-322-7700')
      .setValue('#nasabah-tanggal-lahir', '1990-12-25')
      .setValue('#nasabah-email', 'silver.samurai@edo.jp')
      .click('//*[contains(text(), "Simpan")]')
      .pause(1000)
      .getText('//body')
      .then(function(pageText){
        expect(pageText).to.contain('Wajib diisi');
        return Models.Nasabah.findById(1);
      })
      .then(function(result){
        expect(result.jenis).to.equal('individu');
        expect(result.ktp).to.equal('0001');
        expect(result.nama).to.equal('Hiero');
        expect(result.alamat).to.equal('Gubeng 1');
        expect(result.nama_pj).to.equal('Casilas');
        expect(result.no_induk).to.equal('BSM001');
        expect(result.telepon).to.equal('031-5522001');
        expect(result.tanggal_lahir).to.equal('1990-01-01');
        expect(result.email).to.equal('hiero@gmail.com');
        expect(result.tanggal_daftar).to.exist;

        done();
      })
      .catch(function(error){
        done(error);
      });
    });

  });

});
