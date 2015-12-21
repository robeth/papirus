/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transaction_out_konversi', {
    kode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    jumlah: {
      type: DataTypes.DECIMAL,
      allowNull: true
    }
  }, {
    tableName: 'transaction_out_konversi',
    freezeTableName: true
  });
};
