/* jshint indent: 2 */
var Moment = require('moment');
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Pembelian', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nasabah_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'transaction_nasabah',
        key: 'id'
      }
    },
    tanggal: {
      type: DataTypes.DATE,
      allowNull: false,
      get: function(){
        var pembelianDate = this.getDataValue('tanggal');
        return Moment(pembelianDate).format('YYYY-MM-DD');
      }
    },
    nota: {
      type: DataTypes.STRING,
      allowNull: true
    },
    penarikan_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'transaction_penarikan',
        key: 'id'
      }
    }
  }, {
    tableName: 'transaction_pembelian',
    freezeTableName: true,
    instanceMethods: {
      getStocks: function(){
        return this.getPembelianStocks()
          .then(function(pembelianStocks){
            var stockPromises = pembelianStocks.map(function(pembelianStock){
              return pembelianStock.getStock();
            });

            return Promise.all(stockPromises);
          })
      },
      getValue: function(){
        return this.getStocks()
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
      getWeight: function(){
        return this.getStocks()
          .then(function(stocks){
            return stocks
              .map(function(stock){
                return stock.jumlah;
              })
              .reduce(function(previousValue, currentValue){
                return previousValue + currentValue;
              });
          });
      }
    },
    classMethods: {
      getPenarikanCandidates: function(nasabahId){
        return sequelize.models.Pembelian.findAll({
          attributes: {
            include: [[sequelize.fn('SUM', sequelize.col('Penarikans.total')), 'taken']]
          },
          include: [{ model: sequelize.models.Penarikan, as: 'Penarikans'}],
          where: {
            nasabah_id: nasabahId
          },
          group: ['id']
        }).then(function(pembelians){
          var pembelianPromises = [];

          pembelians.map(function(pembelian){
            var pembelianPromise = pembelian.getValue()
              .then(function(value){
                pembelian.totalValue = value;
                pembelian.paidValue = pembelian.get('taken');
                pembelian.remainingValue = value - pembelian.get('taken');
                return pembelian;
              });
            pembelianPromises.push(pembelianPromise);
            return pembelianPromise;
          });

          return Promise.all(pembelianPromises);
        }).then(function(pembelians){
          return _.sortBy(pembelians, 'tanggal');
        });
      }
    }
  });
};
