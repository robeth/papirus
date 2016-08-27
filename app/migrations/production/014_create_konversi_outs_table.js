var tableName = 'transaction_konversi_outs';

module.exports = {
  up: function(queryInterface, DataTypes){
    console.log('Migration 014');
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
      }
    });
  },
  down: function(queryInterface, DataTypes){
    console.log("Down 014");
    queryInterface.dropTable(tableName);
  }
};
