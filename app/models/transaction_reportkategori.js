/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ReportKategori', {
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
    satuan: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'transaction_reportkategori',
    freezeTableName: true
  });
};
