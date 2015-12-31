var tableName = 'transaction_detailpenjualan';

module.exports = {
  up: function(queryInterface, DataTypes){
    console.log('Migration 011');
    queryInterface.createTable(tableName, {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      penjualan_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'transaction_penjualan',
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
      },
      harga: {
        type: DataTypes.DECIMAL,
        allowNull: false
      }
    });
  },
  down: function(queryInterface, DataTypes){
    queryInterface.dropTable(tableName);
  }
};
