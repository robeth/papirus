/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transaction_detailpenarikan', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    penarikan_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'transaction_penarikan',
        key: 'id'
      }
    },
    pembelian_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'transaction_pembelian',
        key: 'id'
      }
    },
    jumlah: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    tableName: 'transaction_detailpenarikan',
    freezeTableName: true
  });
};
