/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PenjualanStock', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    penjualan_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'transaction_penjualan',
        key: 'id'
      }
    },
    stok_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'transaction_stok',
        key: 'id'
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
    tableName: 'transaction_detailpenjualan',
    freezeTableName: true
  });
};
