var tableName = 'transaction_penjualan';

module.exports = {
  up: function(queryInterface, DataTypes){
    console.log('Migration 010');
    queryInterface.createTable(tableName, {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      vendor_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'transaction_vendor',
          key: 'id'
        }
      },
      tanggal: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      nota: {
        type: DataTypes.STRING,
        allowNull: true
      }
    });
  },
  down: function(queryInterface, DataTypes){
    console.log("Down 010");
    queryInterface.dropTable(tableName);
  }
};
