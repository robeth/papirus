var tableName = 'transaction_detailin';

module.exports = {
  up: function(queryInterface, DataTypes){
    console.log('Migration 013');
    queryInterface.createTable(tableName, {
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
      },
      jumlah: {
        type: DataTypes.DECIMAL,
        allowNull: false
      }
    });
  },
  down: function(queryInterface, DataTypes){
    console.log("Down 013");
    queryInterface.dropTable(tableName);
  }
};
