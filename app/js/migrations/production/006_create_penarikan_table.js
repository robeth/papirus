var tableName = 'transaction_penarikan';

module.exports = {
  up: function(queryInterface, DataTypes){
    console.log('Migration 006');
    queryInterface.createTable(tableName, {
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
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      total: {
        type: DataTypes.DECIMAL(15,2),
        allowNull: false
      },
      nota: {
        type: DataTypes.STRING,
        allowNull: true
      }
    });
  },
  down: function(queryInterface, DataTypes){
    console.log("Down 006");
    queryInterface.dropTable(tableName);
  }
};
