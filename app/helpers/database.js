function getSqlValueString(){
  return DATA
    .map(function(data, index, array){
      return "(" +
        data.id + ",'" +
        data.jenis + "','" +
        data.ktp + "','" +
        data.nama + "','" +
        data.alamat + "','" +
        data.telepon + "','" +
        data.email + "','" +
        data.tanggal_lahir + "','" +
        data.tanggal_daftar + "','" +
        data.nama_pj + "','" +
        data.no_induk + "')";
    })
    .join(',');
}

function getDataQueries(data, columnNames){
  return data.map(function(sample){
    return '('
      + columnNames
        .map(function(columnName){
          return "'" + sample[columnName] + "'";
        })
        .join(',')
      + ')';
  });
}

function getColumnNames(data){
  var sample = data[0];
  var columnNames = [];
  for(property in sample){
    if(sample.hasOwnProperty(property)){
      columnNames.push(property);
    }
  }
  return columnNames;
}

function insertQueryBuilder(tableName, data){
  var columnNames = getColumnNames(data);
  var query = 'INSERT INTO ' + tableName
    + ' ('
    + columnNames.join(',')
    + ') VALUES '
    + getDataQueries(data, columnNames).join(',')
    + ';';
  ;
  console.log('query: ' + query);
  return query;
}

module.exports = {
  insertQueryBuilder: insertQueryBuilder
};
