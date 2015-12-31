var tableName = 'transaction_konversi';

module.exports = {
  up: function(queryInterface, DataTypes){
    console.log('Migration 012');
    queryInterface.createTable(tableName, {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      tanggal: {
        type: DataTypes.DATE,
        allowNull: false
      },
      kode: {
        type: DataTypes.STRING,
        allowNull: true
      }
    });
  },
  down: function(queryInterface, DataTypes){
    queryInterface.dropTable(tableName);
  }
};
