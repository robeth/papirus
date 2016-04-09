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
    }
  });
};
