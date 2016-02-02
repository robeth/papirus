/* jshint indent: 2 */
var Moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Stock', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    kategori_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'transaction_kategori',
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
    jumlah: {
      type: DataTypes.DECIMAL(8,2),
      allowNull: false
    },
    harga: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    }
  }, {
    tableName: 'transaction_stok',
    freezeTableName: true
  });
};
