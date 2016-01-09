var Promise = require('bluebird');
var readFile = Promise.promisify(require('fs').readFile);

var ViewDefinitionPaths = [
  '/../sql/015_view_01_transaction_stok_det.sql',
  '/../sql/015_view_02_transaction_penjualan_total.sql',
  '/../sql/015_view_03_transaction_penjualan_recap.sql',
  '/../sql/015_view_04_transaction_pembelian_total.sql',
  '/../sql/015_view_05_transaction_pembelian_recap.sql',
  '/../sql/015_view_06_transaction_in_stok.sql',
  '/../sql/015_view_07_transaction_out_konversi.sql',
  '/../sql/015_view_08_transaction_out_penjualan.sql',
  '/../sql/015_view_09_stok_remain.sql'
];

var ViewNames = [
  'transaction_stok_det',
  'transaction_penjualan_total',
  'transaction_penjualan_recap',
  'transaction_pembelian_total',
  'transaction_pembelian_recap',
  'transaction_in_stok',
  'transaction_out_konversi',
  'transaction_out_penjualan',
  'stok_remain'
];

var dropViewQueries = ViewNames
  .map(function(viewName){
    return 'DROP VIEW IF EXISTS ' + viewName;
  });

module.exports = {
  up: function(queryInterface, DataTypes){
    console.log('Up 015');
    var viewPromises = ViewDefinitionPaths.map(function(path){
      return readFile( __dirname + path, 'utf8')
        .then(function(content){
          return queryInterface.sequelize.query(content.replace(/\n/g, ' '));
        })
        .then(function(){
          console.log('View: ' + path + ' success');
        });
    });

    return Promise.all(viewPromises);
  },
  down: function(queryInterface, DataTypes){
    console.log("Down 015");
    var dropViewPromises = dropViewQueries.map(function(query){
       return queryInterface.sequelize.query(query.replace(/\n/g, ' '));
    });

    return Promise.all(dropViewPromises);
  }
};
