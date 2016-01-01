var tableName = 'transaction_reportkategori';

var DATA = [
  {
    id: 1,
    jenis: 'individu',
    ktp: '0001',
    nama: 'Hiero',
    alamat: 'Gubeng 1',
    telepon: '031-5522001',
    email: 'hiero@gmail.com',
    tanggal_lahir: '1990-01-01',
    tanggal_daftar: new Date(),
    nama_pj: null,
    no_induk: 'BSM001'
  },
  {
    id: 2,
    jenis: 'kolektif',
    ktp: '0002',
    nama: 'Wonokromo RT 2',
    alamat: 'Wonokromo 2',
    telepon: '031-5522002',
    email: 'messi@gmail.com',
    tanggal_lahir: '1990-02-02',
    tanggal_daftar: new Date(),
    nama_pj: 'Guardiola',
    no_induk: 'BSM002'
  }
];

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

module.exports = {
  up: function(queryInterface, DataTypes){
    console.log('Dummy Migration 001 UP');
    var query = 'insert into transaction_nasabah ' +
    '(id, jenis, ktp, nama, alamat, telepon, email, tanggal_lahir,' +
    ' tanggal_daftar, nama_pj, no_induk) values ' +
    getSqlValueString();
    console.log(query);
    return queryInterface.sequelize.query(query);
  },
  down: function(queryInterface, DataTypes){
    console.log("Dummy Migration 001 DOWN: nothing");
  }
};
