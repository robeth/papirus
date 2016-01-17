/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Penjualan', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    vendor_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'transaction_vendor',
        key: 'id'
      }
    },
    tanggal: {
      type: DataTypes.DATE,
      allowNull: false
    },
    nota: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'transaction_penjualan',
    freezeTableName: true,
    instanceMethods: {
      getValue: function(){
        return this.getPenjualanStocks()
          .then(function(penjualanStocks){
            return penjualanStocks
              .map(function(penjualanStock){
                return penjualanStock.jumlah * penjualanStock.harga;
              })
              .reduce(function(previousValue, currentValue){
                return previousValue + currentValue;
              });
          });
      },
      getWeight: function(){
        return this.getPenjualanStocks()
          .then(function(penjualanStocks){
            return penjualanStocks
              .reduce(function(previousValue, penjualanStock){
                return previousValue + penjualanStock.jumlah
              }, 0);
          });
      }
    }
  });
};
