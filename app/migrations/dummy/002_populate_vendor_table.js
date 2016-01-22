var tableName = 'transaction_reportkategori';
var DatabaseHelper = require('../../helpers/database');

var DATA = [
  {
    id: 1,
    nama: 'PT. Daur Ulang',
    alamat: 'Manukan 1',
    telepon: '031-5522001',
    email: 'daurulang@gmail.com',
    tanggal_daftar: new Date(),
  },
  {
    id: 2,
    nama: 'PT. Tunas Bawang',
    alamat: 'Dukuh 2',
    telepon: '031-5522001',
    email: 'tunasbawang@gmail.com',
    tanggal_daftar: new Date(),
  }
];

var query = DatabaseHelper.insertQueryBuilder('transaction_vendor', DATA);

module.exports = {
  up: function(queryInterface, DataTypes){
    console.log('Dummy Migration 002 UP');
    return queryInterface.sequelize.query(query);
  },
  down: function(queryInterface, DataTypes){
    console.log("Dummy Migration 002 DOWN: delete all vendors");
    return queryInterface.sequelize.query('DELETE FROM transaction_vendor');
  }
};
