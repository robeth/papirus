var tableName = 'transaction_reportkategori';

var DATA = [
  {id: 1, nama: 'Lain-Lain', satuan: 'unit'},
  {id: 2, nama: 'Logam', satuan: 'kg'},
  {id: 3, nama: 'Kaca', satuan: 'kg'},
  {id: 4, nama: 'Plastik', satuan: 'kg'},
  {id: 5, nama: 'Plastik non lembar', satuan: 'kg'},
  {id: 6, nama: 'Kertas', satuan: 'kg'},
];

function getSqlValueString(){
  return DATA
    .map(function(data, index, array){
      return "(" + data.id + ",'" + data.nama + "','" + data.satuan + "')";
    })
    .join(',');
}

module.exports = {
  up: function(queryInterface, DataTypes){
    console.log('Migration 003');
    queryInterface.createTable(tableName, {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false
      },
      satuan: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }).then(function(){
      queryInterface.sequelize.query(
        'insert into transaction_reportkategori ' +
        '(id, nama, satuan) values ' +
        getSqlValueString()).then(function(){
        });
    });
  },
  down: function(queryInterface, DataTypes){
    queryInterface.dropTable(tableName);
  }
};
