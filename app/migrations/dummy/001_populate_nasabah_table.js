var tableName = 'transaction_reportkategori';
var DatabaseHelper = require('../../helpers/database');

var DATA = [
  {
    id: 1,
    jenis: 'individu',
    ktp: '0001',
    nama: 'Hiero',
    alamat: 'Gubeng 1',
    telepon: '031-5522001',
    email: 'hiero@gmail.com',
    tanggal_lahir: '1990-01-01',
    tanggal_daftar: new Date(),
    nama_pj: 'Casilas',
    no_induk: 'BSM001'
  },
  {
    id: 2,
    jenis: 'kolektif',
    ktp: '0002',
    nama: 'Wonokromo RT 2',
    alamat: 'Wonokromo 2',
    telepon: '031-5522002',
    email: 'messi@gmail.com',
    tanggal_lahir: '1990-02-02',
    tanggal_daftar: new Date(),
    nama_pj: 'Guardiola',
    no_induk: 'BSM002'
  }
];

var query = DatabaseHelper.insertQueryBuilder('transaction_nasabah', DATA);

module.exports = {
  up: function(queryInterface, DataTypes){
    console.log('Dummy Migration 001 UP');
    return queryInterface.sequelize.query(query);
  },
  down: function(queryInterface, DataTypes){
    console.log("Dummy Migration 001 DOWN: delete all nasabah ");
    return queryInterface.sequelize.query('DELETE FROM transaction_nasabah');
  }
};
