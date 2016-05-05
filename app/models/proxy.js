var Sequelize = window.originalRequire('sequelize');
var sequelize = null;
var models = null;

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

function test(params){
  sequelize = new Sequelize(
    params.name,
    params.username,
    params.password,
    {
      host: params.host,
      dialect: 'mysql',
      define:{
        timestamps: false
      }
    }
  );

  return sequelize.authenticate();
}

function setup(){
  console.log('setup');
  models = {}

  // Register All Models
  for(var modelName in MODEL_DICTIONARY){
    // Make sure prototype/built-in attribute doesn't pass
    if(MODEL_DICTIONARY.hasOwnProperty(modelName)){
      var tableName = MODEL_DICTIONARY[modelName];
      var model = window.originalRequire('./models/' + tableName);
      console.log(model);
      models[modelName] = sequelize.import(tableName, model);
    }
  }

  // Register Raw
  models.RawQueries = require('./raw_queries')(sequelize);

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

  models.Stock.belongsTo(models.Kategori, {
    as: 'Kategori',
    foreignKey: 'kategori_id'
  });

  models.Kategori.hasMany(models.Stock, {
    as: 'Stocks',
    foreignKey: 'kategori_id'
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

  models.Nasabah.hasMany(models.Penarikan, {
    as: 'Penarikans',
    foreignKey: 'nasabah_id'
  });

  models.Penarikan.belongsTo(models.Nasabah, {
    as: 'Nasabah',
    foreignKey: 'nasabah_id'
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
}

function connect(params){
  var testConnection = test(params);
  testConnection
    .then(function(){
      setup();
    })
    .catch(function(error){
      return error;
    });

  return testConnection;
}

function get(modelName){
  console.log(models);
  return models[modelName];
}

module.exports = {
  connect: connect,
  get: get
};
