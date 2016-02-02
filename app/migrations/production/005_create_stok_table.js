var tableName = 'transaction_stok';

module.exports = {
  up: function(queryInterface, DataTypes){
    console.log('Migration 005');
    queryInterface.createTable(tableName, {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      kategori_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'transaction_kategori',
          key: 'id'
        }
      },
      tanggal: {
        type: DataTypes.DATE,
        allowNull: false
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
    console.log("Down 005");
    queryInterface.dropTable(tableName);
  }
};
