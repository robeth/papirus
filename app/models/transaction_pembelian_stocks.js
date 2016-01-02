/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PembelianStock', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    pembelian_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'transaction_pembelian',
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
    }
  }, {
    tableName: 'transaction_pembelian_stocks',
    freezeTableName: true
  });
};
