/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transaction_in_stok', {
    kode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    jumlah: {
      type: DataTypes.DECIMAL,
      allowNull: true
    }
  }, {
    tableName: 'transaction_in_stok',
    freezeTableName: true
  });
};
