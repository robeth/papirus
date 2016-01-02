/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Penarikan', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nasabah_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'transaction_nasabah',
        key: 'id'
      }
    },
    tanggal: {
      type: DataTypes.DATE,
      allowNull: false
    },
    total: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    nota: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'transaction_penarikan',
    freezeTableName: true
  });
};
