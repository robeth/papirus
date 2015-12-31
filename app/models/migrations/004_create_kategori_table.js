var tableName = 'transaction_kategori';

module.exports = {
  up: function(queryInterface, DataTypes){
    console.log('Migration 004');
    queryInterface.createTable(tableName, {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      kode: {
        type: DataTypes.STRING,
        allowNull: false
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false
      },
      deskripsi: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      satuan: {
        type: DataTypes.STRING,
        allowNull: false
      },
      foto: {
        type: DataTypes.STRING,
        allowNull: true
      },
      stabil: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: '0.00'
      },
      fluktuatif: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: '0.00'
      },
      report_kategori_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'transaction_reportkategori',
          key: 'id'
        }
      }
    });
  },
  down: function(queryInterface, DataTypes){
    queryInterface.dropTable(tableName);
  }
};
