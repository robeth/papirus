var tableName = 'transaction_pembelian_stocks';

module.exports = {
  up: function(queryInterface, DataTypes){
    console.log('Migration 008');
    queryInterface.createTable(tableName, {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      pembelian_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'transaction_pembelian',
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
    });
  },
  down: function(queryInterface, DataTypes){
    console.log("Down 008");
    queryInterface.dropTable(tableName);
  }
};
