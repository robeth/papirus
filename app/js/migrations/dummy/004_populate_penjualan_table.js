var DatabaseHelper = require('../../helpers/database');
var Moment = require('moment');
var today = Moment(new Date()).format('YYYY-MM-DD');
var tomorrow = Moment(new Date()).add(1, 'days').format('YYYY-MM-DD');

var PENJUALAN_DATA = [
  {
    id: 1,
    vendor_id: 1,
    tanggal: today,
    nota: 'J001'
  },
  {
    id: 2,
    vendor_id: 2,
    tanggal: tomorrow,
    nota: 'J002'
  }
];

var PENJUALAN_STOCK_DATA = [
  {
    id: 1,
    penjualan_id: 1,
    stok_id: 1,
    jumlah: 10,
    harga: 6000
  },
  {
    id: 2,
    penjualan_id: 1,
    stok_id: 5,
    jumlah: 5,
    harga: 6000
  },
  {
    id: 3,
    penjualan_id: 1,
    stok_id: 3,
    jumlah: 15,
    harga: 4700
  },
  {
    id: 4,
    penjualan_id: 2,
    stok_id: 5,
    jumlah: 8,
    harga: 7500
  },
  {
    id: 5,
    penjualan_id: 2,
    stok_id: 2,
    jumlah: 10,
    harga: 3000
  }
]

var penjualanQuery = DatabaseHelper.insertQueryBuilder('transaction_penjualan', PENJUALAN_DATA);
var penjualanStockQuery = DatabaseHelper.insertQueryBuilder('transaction_detailpenjualan', PENJUALAN_STOCK_DATA);

module.exports = {
  up: function(queryInterface, DataTypes){
    console.log('Dummy Migration 004 UP');
    return queryInterface.sequelize.query(penjualanQuery)
      .then(function(){
        return queryInterface.sequelize.query(penjualanStockQuery);
      });
  },
  down: function(queryInterface, DataTypes){
    console.log("Dummy Migration 004 DOWN: delete all penjualan data");
    return queryInterface.sequelize.query('DELETE FROM transaction_detailpenjualan')
      .then(function(){
        return queryInterface.sequelize.query('DELETE FROM transaction_penjualan');
      });
  }
};
