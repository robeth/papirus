var setup = require('./setup');
var expect = require('chai').expect;
var driver = setup.driver;
var migration = setup.migration;
var Models = require('../build/models/');
var Promise = require('bluebird');
var Moment = require('moment');
var today = Moment(new Date()).format('YYYY-MM-DD');

describe('Pembelian Scenarios', function(){
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

  describe("Add Pembelian", function(done){

    beforeEach(function(done){
      driver
        .click('#menu-form')
        .pause(1000)
        .click('#menu-form-pembelian')
        .pause(1000)
        .then(function(){
          done();
        });
    });

    it('should save new pembelian on valid data', function(done){
      driver
        .setValue('#pembelian-tanggal','2016-08-17')
        .setValue('#pembelian-nota', 'B-001')
        .clickAnOption('nasabah-id', 'Wonokromo RT 2', 'span')
        .clickAnOption('pembelian-stock-kategori-id-0', 'Panci dan Wajan', 'span')
        .setValue('#pembelian-stock-jumlah-0', '10')
        .setValue('#pembelian-stock-harga-0', '1500')
        .click('//*[contains(text(), "Tambah")]')
        .clickAnOption('pembelian-stock-kategori-id-1', 'Seng', 'span')
        .setValue('#pembelian-stock-jumlah-1', '20')
        .setValue('#pembelian-stock-harga-1', '2200')
        .click('//*[contains(text(), "Simpan")]')
        .pause(1000)
        .getText('//body')
        .then(function(pageText){
          expect(pageText).to.contain('Sukses!');
          expect(pageText).to.include('Pembelian baru berhasil dibuat!');
          return Models.Pembelian.findAll({
            where: {
              nota: 'B-001'
            }
          });
        })
        .then(function(results){
          expect(results).to.have.length(1);

          var result = results[0];
          expect(result.nasabah_id).to.equal(2);
          expect(result.tanggal).to.equal('2016-08-17');
          expect(result.nota).to.equal('B-001');

          return result.getPembelianStocks();
        })
        .then(function(pembelianStocks){
          expect(pembelianStocks).to.have.length(2);

          var stockPromises = pembelianStocks.map(function(element){
            return element.getStock();
          });

          return Promise.all(stockPromises);
        })
        .then(function(stocks){
          expect(stocks).to.have.length(2);

          function customCompare(a, b) {
            return a.kategori_id - b.kategori_id;
          }

          stocks.sort(customCompare);

          expect(stocks[0].kategori_id).to.equal(12);
          expect(stocks[0].tanggal).to.equal('2016-08-17');
          expect(stocks[0].jumlah).to.equal(10);
          expect(stocks[0].harga).to.equal(1500);

          expect(stocks[1].kategori_id).to.equal(18);
          expect(stocks[1].tanggal).to.equal('2016-08-17');
          expect(stocks[1].jumlah).to.equal(20);
          expect(stocks[1].harga).to.equal(2200);

          done();
        })
        .catch(function(error){
          done(error);
        });
    });

    it('should show error on invalid data', function(done){
      driver
        .setValue('#pembelian-tanggal','2016-08-17')
        .setValue('#pembelian-nota', 'B-001')
        .clickAnOption('nasabah-id', 'Wonokromo RT 2', 'span')
        .clickAnOption('pembelian-stock-kategori-id-0', 'Panci dan Wajan', 'span')
        .setValue('#pembelian-stock-jumlah-0', ' ')
        .setValue('#pembelian-stock-harga-0', '1500')
        .click('//*[contains(text(), "Tambah")]')
        .clickAnOption('pembelian-stock-kategori-id-1', 'Seng', 'span')
        .setValue('#pembelian-stock-jumlah-1', '20')
        .setValue('#pembelian-stock-harga-1', '2200')
        .click('//*[contains(text(), "Simpan")]')
        .pause(1000)
        .getText('//body')
        .then(function(pageText){
          expect(pageText).to.contain('Wajib diisi');
          return Models.Pembelian.findAll({
            where: {
              tanggal: '2016-08-17'
            }
          });
        })
        .then(function(results){
          expect(results).to.have.length(0);
          return Models.Stock.findAll({
            where: {
              tanggal: '2016-08-17'
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

  describe('Edit Pembelian', function(done){
    beforeEach(function(done){
      driver
        .click('#menu-data')
        .pause(1000)
        .click('#menu-data-pembelian')
        .pause(1000)
        .click('//td//a/span[contains(text(), "B1")]')
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

    it('should update pembelian on valid data', function(done){
      driver
      .setValue('#pembelian-tanggal','2016-08-17')
      .setValue('#pembelian-nota', 'B-001')
      .clickAnOption('nasabah-id', 'Wonokromo RT 2', 'span')
      .clickAnOption('pembelian-stock-kategori-id-0', 'Panci dan Wajan', 'span')
      .setValue('#pembelian-stock-jumlah-0', '18')
      .setValue('#pembelian-stock-harga-0', '1500')
      .click('//*[contains(text(), "Tambah")]')
      .clickAnOption('pembelian-stock-kategori-id-2', 'Seng', 'span')
      .setValue('#pembelian-stock-jumlah-2', '20')
      .setValue('#pembelian-stock-harga-2', '2200')
      .click('//*[contains(text(), "Simpan")]')
      .pause(1000)
      .getText('//body')
      .then(function(pageText){
        expect(pageText).to.contain('Sukses!');
        expect(pageText).to.include('Pembelian berhasil diubah!');
        return Models.Pembelian.findById(1);
      })
      .then(function(result){
        expect(result.nasabah_id).to.equal(2);
        expect(result.tanggal).to.equal('2016-08-17');
        expect(result.nota).to.equal('B-001');

        return result.getPembelianStocks();
      })
      .then(function(pembelianStocks){
        expect(pembelianStocks).to.have.length(3);

        var stockPromises = pembelianStocks.map(function(element){
          return element.getStock();
        });

        return Promise.all(stockPromises);
      })
      .then(function(stocks){
        expect(stocks).to.have.length(3);

        function customCompare(a, b) {
          return a.kategori_id - b.kategori_id;
        }

        stocks.sort(customCompare);

        expect(stocks[0].kategori_id).to.equal(7);
        expect(stocks[0].tanggal).to.equal('2016-08-17');
        expect(stocks[0].jumlah).to.equal(20);
        expect(stocks[0].harga).to.equal(2000);

        expect(stocks[1].kategori_id).to.equal(12);
        expect(stocks[1].tanggal).to.equal('2016-08-17');
        expect(stocks[1].jumlah).to.equal(18);
        expect(stocks[1].harga).to.equal(1500);

        expect(stocks[2].kategori_id).to.equal(18);
        expect(stocks[2].tanggal).to.equal('2016-08-17');
        expect(stocks[2].jumlah).to.equal(20);
        expect(stocks[2].harga).to.equal(2200);

        done();
      })
      .catch(function(error){
        done(error);
      });
    });

    it('should not update pembelian on cancel', function(done){
      driver
      .setValue('#pembelian-tanggal','2016-08-17')
      .setValue('#pembelian-nota', 'B-001')
      .clickAnOption('nasabah-id', 'Wonokromo RT 2', 'span')
      .clickAnOption('pembelian-stock-kategori-id-0', 'Panci dan Wajan', 'span')
      .setValue('#pembelian-stock-jumlah-0', '18')
      .setValue('#pembelian-stock-harga-0', '1500')
      .click('//*[contains(text(), "Tambah")]')
      .clickAnOption('pembelian-stock-kategori-id-2', 'Seng', 'span')
      .setValue('#pembelian-stock-jumlah-2', '20')
      .setValue('#pembelian-stock-harga-2', '2200')
      .click('//*[contains(text(), "Batal")]')
      .pause(1000)
      .getText('//body')
      .then(function(pageText){
        expect(pageText).to.not.contain('Sukses!');
        return Models.Pembelian.findById(1);
      })
      .then(function(result){
        expect(result.nasabah_id).to.equal(1);
        expect(result.tanggal).to.equal(today);
        expect(result.nota).to.equal('P001');

        return result.getPembelianStocks();
      })
      .then(function(pembelianStocks){
        expect(pembelianStocks).to.have.length(2);

        var stockPromises = pembelianStocks.map(function(element){
          return element.getStock();
        });

        return Promise.all(stockPromises);
      })
      .then(function(stocks){
        expect(stocks).to.have.length(2);

        function customCompare(a, b) {
          return a.kategori_id - b.kategori_id;
        }

        stocks.sort(customCompare);

        expect(stocks[0].kategori_id).to.equal(6);
        expect(stocks[0].tanggal).to.equal(today);
        expect(stocks[0].jumlah).to.equal(10);
        expect(stocks[0].harga).to.equal(1000);

        expect(stocks[1].kategori_id).to.equal(7);
        expect(stocks[1].tanggal).to.equal(today);
        expect(stocks[1].jumlah).to.equal(20);
        expect(stocks[1].harga).to.equal(2000);

        done();
      })
      .catch(function(error){
        done(error);
      });
    });

    it('should not update pembelian on invalid data', function(done){
      driver
      .setValue('#pembelian-tanggal','2016-08-17')
      .setValue('#pembelian-nota', 'B-001')
      .clickAnOption('nasabah-id', 'Wonokromo RT 2', 'span')
      .clickAnOption('pembelian-stock-kategori-id-0', 'Panci dan Wajan', 'span')
      .setValue('#pembelian-stock-jumlah-0', ' ')
      .setValue('#pembelian-stock-harga-0', '1500')
      .click('//*[contains(text(), "Tambah")]')
      .clickAnOption('pembelian-stock-kategori-id-2', 'Seng', 'span')
      .setValue('#pembelian-stock-jumlah-2', '20')
      .setValue('#pembelian-stock-harga-2', '2200')
      .click('//*[contains(text(), "Simpan")]')
      .pause(1000)
      .getText('//body')
      .then(function(pageText){
        expect(pageText).to.contain('Wajib diisi');
        return Models.Pembelian.findById(1);
      })
      .then(function(result){
        expect(result.nasabah_id).to.equal(1);
        expect(result.tanggal).to.equal(today);
        expect(result.nota).to.equal('P001');

        return result.getPembelianStocks();
      })
      .then(function(pembelianStocks){
        expect(pembelianStocks).to.have.length(2);

        var stockPromises = pembelianStocks.map(function(element){
          return element.getStock();
        });

        return Promise.all(stockPromises);
      })
      .then(function(stocks){
        expect(stocks).to.have.length(2);

        function customCompare(a, b) {
          return a.kategori_id - b.kategori_id;
        }

        stocks.sort(customCompare);

        expect(stocks[0].kategori_id).to.equal(6);
        expect(stocks[0].tanggal).to.equal(today);
        expect(stocks[0].jumlah).to.equal(10);
        expect(stocks[0].harga).to.equal(1000);

        expect(stocks[1].kategori_id).to.equal(7);
        expect(stocks[1].tanggal).to.equal(today);
        expect(stocks[1].jumlah).to.equal(20);
        expect(stocks[1].harga).to.equal(2000);

        done();
      })
      .catch(function(error){
        done(error);
      });
    });

  });

});
