/* jshint indent: 2 */
var Moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Penarikan', {
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
        var penarikanDate = this.getDataValue('tanggal');
        return Moment(penarikanDate).format('YYYY-MM-DD');
      }
    },
    total: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    nota: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'transaction_penarikan',
    freezeTableName: true,
    instanceMethods: {
      getValue: function(){
        return this.getDataValue('Pembelians').reduce(
          function(prev, pembelian){
            return pembelian.PenarikanDetail.jumlah + prev;
          },
          0
        );
      }
    }
  });
};
