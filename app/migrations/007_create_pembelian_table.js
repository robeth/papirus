var tableName = 'transaction_pembelian';

module.exports = {
  up: function(queryInterface, DataTypes){
    console.log('Migration 007');
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
        type: DataTypes.DATE,
        allowNull: false
      },
      nota: {
        type: DataTypes.STRING,
        allowNull: true
      },
      penarikan_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        references: {
          model: 'transaction_penarikan',
          key: 'id'
        }
      }
    });
  },
  down: function(queryInterface, DataTypes){
    console.log("Down 007");
    queryInterface.dropTable(tableName);
  }
};
