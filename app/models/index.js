var Sequelize = require('sequelize');
var config = require('./../vendor/electron_boilerplate/env_config');
if(typeof window === 'object'){
  config = window.env;
}

var sequelize = new Sequelize(
  config.database.name,
  config.database.username,
  config.database.password,
  {
    host: config.database.host,
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
  'Stock': 'transaction_stok',
  'Penarikan': 'transaction_penarikan',
  'Pembelian': 'transaction_pembelian',
  'PembelianStock': 'transaction_pembelian_stocks',
  'PenarikanDetail': 'transaction_detailpenarikan',
  'Penjualan': 'transaction_penjualan',
  'PenjualanStock': 'transaction_detailpenjualan',
  'Konversi': 'transaction_konversi',
  'KonversiInStock': 'transaction_detailin',
  'KonversiOutStock': 'transaction_konversi_outs'
}

var models = {}

// Register All Models
for(var modelName in MODEL_DICTIONARY){
  // Make sure prototype/built-in attribute doesn't pass
  if(MODEL_DICTIONARY.hasOwnProperty(modelName)){
    var tableName = MODEL_DICTIONARY[modelName];
    models[modelName] = sequelize.import(tableName, require('./' + tableName));
  }
}

models.Nasabah.hasMany(models.Pembelian, {
  as: 'Pembelians',
  foreignKey: 'nasabah_id'
});

models.Pembelian.belongsTo(models.Nasabah, {
  as: 'Nasabah',
  foreignKey: 'nasabah_id'
});

models.Pembelian.hasMany(models.PembelianStock, {
  as: 'PembelianStocks',
  foreignKey: 'pembelian_id'
});

models.PembelianStock.belongsTo(models.Pembelian, {
  as: 'Pembelian',
  foreignKey: 'pembelian_id'
});

models.PembelianStock.belongsTo(models.Stock, {
  as: 'Stock',
  foreignKey: 'stok_id'
});

models.Vendor.hasMany(models.Penjualan, {
  as: 'Penjualans',
  foreignKey: 'vendor_id'
});

models.Penjualan.belongsTo(models.Vendor, {
  as: 'Vendor',
  foreignKey: 'vendor_id'
});

models.Penjualan.hasMany(models.PenjualanStock, {
  as: 'PenjualanStocks',
  foreignKey: 'penjualan_id'
});

models.PenjualanStock.belongsTo(models.Penjualan, {
  as: 'Penjualan',
  foreignKey: 'penjualan_id'
});

models.PenjualanStock.belongsTo(models.Stock, {
  as: 'Stock',
  foreignKey: 'stok_id'
});

models.Kategori.belongsTo(models.ReportKategori, {
  as: 'ReportCategory',
  foreignKey: 'report_kategori_id'
});

models.ReportKategori.hasMany(models.Kategori, {
  as: 'Categories',
  foreignKey: 'report_kategori_id'
});

models.Konversi.hasMany(models.KonversiInStock, {
  as: 'KonversiInStocks',
  foreignKey: 'konversi_id'
});

models.Konversi.hasMany(models.KonversiOutStock, {
  as: 'KonversiOutStocks',
  foreignKey: 'konversi_id'
});

models.KonversiInStock.belongsTo(models.Konversi, {
  as: 'Konversi',
  foreignKey: 'konversi_id'
});

models.KonversiOutStock.belongsTo(models.Konversi, {
  as: 'Konversi',
  foreignKey: 'konversi_id'
});

models.KonversiInStock.belongsTo(models.Stock, {
  as: 'Stock',
  foreignKey: 'stok_id'
});

models.KonversiOutStock.belongsTo(models.Stock, {
  as: 'Stock',
  foreignKey: 'stok_id'
});

models.Penarikan.belongsToMany(models.Pembelian, {
  through: models.PenarikanDetail,
  as: 'Pembelians',
  foreignKey: 'penarikan_id'
});

models.Pembelian.belongsToMany(models.Penarikan, {
  through: models.PenarikanDetail,
  foreignKey: 'pembelian_id',
  as: 'Penarikans'
});

module.exports = models;
