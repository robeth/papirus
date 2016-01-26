var tableName = 'transaction_reportkategori';
var DatabaseHelper = require('../../helpers/database');
var Moment = require('moment');
var today = Moment(new Date()).format('YYYY-MM-DD');

var PEMBELIAN_DATA = [
  {
    id: 1,
    nasabah_id: 1,
    tanggal: today,
    nota: 'P001'
  },
  {
    id: 2,
    nasabah_id: 1,
    tanggal: today,
    nota: 'P002'
  },
  {
    id: 3,
    nasabah_id: 2,
    tanggal: today,
    nota: 'P003'
  },
  {
    id: 4,
    nasabah_id: 2,
    tanggal: today,
    nota: 'P004'
  },
];

var STOCK_DATA = [
  {
    id: 1,
    kategori_id: 6,
    tanggal: today,
    jumlah: 10,
    harga: 1000
  },
  {
    id: 2,
    kategori_id: 7,
    tanggal: today,
    jumlah: 20,
    harga: 2000
  },
  {
    id: 3,
    kategori_id: 8,
    tanggal: today,
    jumlah: 30,
    harga: 3000
  },
  {
    id: 4,
    kategori_id: 9,
    tanggal: today,
    jumlah: 40,
    harga: 4000
  },
  {
    id: 5,
    kategori_id: 6,
    tanggal: today,
    jumlah: 50,
    harga: 5000
  },
  {
    id: 6,
    kategori_id: 7,
    tanggal: today,
    jumlah: 60,
    harga: 6000
  },
  {
    id: 7,
    kategori_id: 12,
    tanggal: today,
    jumlah: 70,
    harga: 7000
  },
  {
    id: 8,
    kategori_id: 13,
    tanggal: today,
    jumlah: 80,
    harga: 8000
  },
];

var PEMBELIAN_STOCK_DATA = [
  {
    id: 1,
    pembelian_id: 1,
    stok_id: 1
  },
  {
    id: 2,
    pembelian_id: 1,
    stok_id: 2
  },
  {
    id: 3,
    pembelian_id: 2,
    stok_id: 3
  },
  {
    id: 4,
    pembelian_id: 2,
    stok_id: 4
  },
  {
    id: 5,
    pembelian_id: 3,
    stok_id: 5
  },
  {
    id: 6,
    pembelian_id: 3,
    stok_id: 6
  },
  {
    id: 7,
    pembelian_id: 4,
    stok_id: 7
  },
  {
    id: 8,
    pembelian_id: 4,
    stok_id: 8
  },
]

var pembelianQuery = DatabaseHelper.insertQueryBuilder('transaction_pembelian', PEMBELIAN_DATA);
var stockQuery = DatabaseHelper.insertQueryBuilder('transaction_stok', STOCK_DATA);
var pembelianStockQuery = DatabaseHelper.insertQueryBuilder('transaction_pembelian_stocks', PEMBELIAN_STOCK_DATA);

module.exports = {
  up: function(queryInterface, DataTypes){
    console.log('Dummy Migration 003 UP');
    return queryInterface.sequelize.query(pembelianQuery)
      .then(function(){
        return queryInterface.sequelize.query(stockQuery);
      })
      .then(function(){
        return queryInterface.sequelize.query(pembelianStockQuery);
      });
  },
  down: function(queryInterface, DataTypes){
    console.log("Dummy Migration 003 DOWN: delete all pembelian data");
    return queryInterface.sequelize.query('DELETE FROM transaction_pembelian_stocks')
      .then(function(){
        return queryInterface.sequelize.query('DELETE FROM transaction_stok');
      })
      .then(function(){
        return queryInterface.sequelize.query('DELETE FROM transaction_pembelian');
      });
  }
};
