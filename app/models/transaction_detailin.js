/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transaction_detailin', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    konversi_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'transaction_konversi',
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
    }
  }, {
    tableName: 'transaction_detailin',
    freezeTableName: true
  });
};
