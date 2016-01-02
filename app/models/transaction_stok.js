/* jshint indent: 2 */

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
      allowNull: false
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
    tableName: 'transaction_stok',
    freezeTableName: true
  });
};
