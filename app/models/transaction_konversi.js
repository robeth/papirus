/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Konversi', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    tanggal: {
      type: DataTypes.DATE,
      allowNull: false
    },
    kode: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'transaction_konversi',
    freezeTableName: true
  });
};
