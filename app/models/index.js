var Sequelize = require('sequelize');

var sequelize = new Sequelize(
  'papirus',
  'root',
  'root',
  {
    host: 'localhost',
    dialect: 'mysql',
    define:{
      timestamps: false
    }
  }
);

// Model name & import path/table name pair
var MODEL_DICTIONARY = {
  'Sequelize': 'sequelize-meta',
  'Nasabah': 'transaction_nasabah',
  'Vendor': 'transaction_vendor',
  'ReportKategori': 'transaction_reportkategori',
  'Kategori': 'transaction_kategori',
  'Stok': 'transaction_stok',
  'Penarikan': 'transaction_penarikan',
  'Pembelian': 'transaction_pembelian',
  'StokPembelian': 'transaction_pembelian_stocks',
  'DetailPenarikan': 'transaction_detailpenarikan',
  'Penjualan': 'transaction_penjualan',
  'DetailPenjualan': 'transaction_detailpenjualan',
  'Konversi': 'transaction_konversi',
  'DetailIn': 'transaction_detailin',
  'KonversiOut': 'transaction_konversi_outs'
}

module.exports = {}

// Register All Models
for(var modelName in MODEL_DICTIONARY){
  // Make sure prototype/built-in attribute doesn't pass
  if(MODEL_DICTIONARY.hasOwnProperty(modelName)){
    var tableName = MODEL_DICTIONARY[modelName];
    module.exports[modelName] = sequelize.import(tableName, require('./' + tableName));
  }
}
