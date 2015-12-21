/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transaction_detailpenjualan', {
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
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    harga: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    tableName: 'transaction_detailpenjualan',
    freezeTableName: true
  });
};