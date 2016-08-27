var tableName = 'transaction_vendor';

module.exports = {
  up: function(queryInterface, DataTypes){
    console.log('Migration 002');
    queryInterface.createTable(tableName, {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false
      },
      alamat: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      telepon: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true
      },
      tanggal_daftar: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      foto: {
        type: DataTypes.STRING,
        allowNull: true
      }
    });
  },
  down: function(queryInterface, DataTypes){
    console.log("Down 002");
    queryInterface.dropTable(tableName);
  }
};
