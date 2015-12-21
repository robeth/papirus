/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transaction_vendor', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    telepon: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tanggal_daftar: {
      type: DataTypes.DATE,
      allowNull: false
    },
    foto: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'transaction_vendor',
    freezeTableName: true
  });
};
