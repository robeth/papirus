var tableName = 'transaction_detailpenarikan';

module.exports = {
  up: function(queryInterface, DataTypes){
    console.log('Migration 009');
    queryInterface.createTable(tableName, {
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
    });
  },
  down: function(queryInterface, DataTypes){
    queryInterface.dropTable(tableName);
  }
};
