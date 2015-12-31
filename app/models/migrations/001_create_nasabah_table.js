var tableName = 'transaction_nasabah';

module.exports = {
  up: function(queryInterface, DataTypes){
    console.log('Migration 001');
    queryInterface.createTable(tableName, {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      ktp: {
        type: DataTypes.STRING,
        allowNull: true
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
      tanggal_lahir: {
        type: DataTypes.DATE,
        allowNull: true
      },
      tanggal_daftar: {
        type: DataTypes.DATE,
        allowNull: false
      },
      foto: {
        type: DataTypes.STRING,
        allowNull: true
      },
      jenis: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'individu'
      },
      nama_pj: {
        type: DataTypes.STRING,
        allowNull: true
      },
      no_induk: {
        type: DataTypes.STRING,
        allowNull: true
      }
    });
  },
  down: function(queryInterface, DataTypes){
    queryInterface.dropTable(tableName);
  }
};
