/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transaction_konversi_outs', {
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
    }
  }, {
    tableName: 'transaction_konversi_outs',
    freezeTableName: true
  });
};
