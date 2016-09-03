/* jshint indent: 2 */
var Moment = require('moment');
var Promise = require('bluebird');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Konversi', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      get: function(){
        var pembelianDate = this.getDataValue('tanggal');
        return Moment(pembelianDate).format('YYYY-MM-DD');
      }
    },
    kode: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'transaction_konversi',
    freezeTableName: true,
    instanceMethods: {
      getOutputStocks: function(){
        return this.getKonversiOutStocks()
          .then(function(konversiOutStocks){
            var stockPromises = konversiOutStocks.map(function(konversiOutStock){
              return konversiOutStock.getStock();
            });

            return Promise.all(stockPromises);
          })
      },
      getValue: function(){
        return this.getOutputStocks()
          .then(function(stocks){
            return stocks
              .map(function(stock){
                return stock.jumlah * stock.harga;
              })
              .reduce(function(previousValue, currentValue){
                return previousValue + currentValue;
              });
          });
      },
      getOutputWeight: function(){
        return this.getOutputStocks()
          .then(function(stocks){
            return stocks
              .map(function(stock){
                return stock.jumlah;
              })
              .reduce(function(previousValue, currentValue){
                return previousValue + currentValue;
              });
          });
      },
      getInputWeight: function(){
        return this.getKonversiInStocks()
          .then(function(konversiInStocks){
            return konversiInStocks
              .reduce(function(previousValue, konversiInStock){
                return previousValue + konversiInStock.jumlah;
              }, 0);
          });
      }
    },
    classMethods: {
      findAllEager: function(startDate, endDate){
        return sequelize.models.Konversi.findAll({
          include: [
            {
              model: sequelize.models.KonversiInStock,
              as: 'KonversiInStocks',
              include: [
                {
                  model: sequelize.models.Stock,
                  as: 'Stock'
                }
              ]
            },
            {
              model: sequelize.models.KonversiOutStock,
              as: 'KonversiOutStocks',
              include: [
                {
                  model: sequelize.models.Stock,
                  as: 'Stock'
                }
              ]
            }
          ],
          where: {
            tanggal: {
              $gte: startDate,
              $lte: endDate
            }
          }
        })
        .then(function(konversis){
          konversis.forEach(function(konversi){

            var inputValue = konversi.KonversiInStocks.reduce(function(result, inStock){
              return result + inStock.jumlah * inStock.Stock.harga;
            }, 0);

            var inputWeight = konversi.KonversiInStocks.reduce(function(result, inStock){
              return result + inStock.jumlah;
            }, 0);

            var outputValue = konversi.KonversiOutStocks.reduce(function(result, outStock){
              return result + outStock.Stock.jumlah * outStock.Stock.harga;
            }, 0);

            var outputWeight = konversi.KonversiOutStocks.reduce(function(result, outStock){
              return result + outStock.Stock.jumlah;
            }, 0);

            konversi.inputValue = inputValue;
            konversi.inputWeight = inputWeight;
            konversi.outputValue = outputValue;
            konversi.outputWeight = outputWeight;
        });

          return konversis;
        });
      }
    }
  });
};
