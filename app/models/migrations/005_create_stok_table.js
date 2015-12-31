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
