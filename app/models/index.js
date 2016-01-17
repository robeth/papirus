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
  as: 'penjualanStocks',
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

module.exports = models;
