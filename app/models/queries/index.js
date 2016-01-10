var readFileSync = require('fs').readFileSync;

var QUERY_FILES = [
  {name: 'getRemainingStocks', filename: 'get_remaining_stocks.sql'}
];

module.exports = {};

for(var i = 0, n = QUERY_FILES.length; i < n; i++){
  module.exports[QUERY_FILES[i].name] =
    readFileSync(__dirname + '/' + QUERY_FILES[i].filename,'utf8')
      .replace(/\n/g, ' ');
}
