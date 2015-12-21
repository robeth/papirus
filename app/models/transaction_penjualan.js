/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transaction_penjualan', {
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
    freezeTableName: true
  });
};
