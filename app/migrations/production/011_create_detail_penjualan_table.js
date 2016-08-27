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
        type: DataTypes.DECIMAL(8,2),
        allowNull: false
      },
      harga: {
        type: DataTypes.DECIMAL(15,2),
        allowNull: false
      }
    });
  },
  down: function(queryInterface, DataTypes){
    console.log("Down 011");
    queryInterface.dropTable(tableName);
  }
};
