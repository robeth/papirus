/* jshint indent: 2 */
var Moment = window.moment;
module.exports = function(sequelize, DataTypes) {
  console.log(sequelize);
  return sequelize.define('transaction_nasabah', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ktp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    telepon: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tanggal_lahir: {
      type: DataTypes.DATE,
      allowNull: true,
      get: function(){
        var bornDate = this.getDataValue('tanggal_lahir');
        return Moment(bornDate).format('YYYY-MM-DD');
      }
    },
    tanggal_daftar: {
      type: DataTypes.DATE,
      allowNull: false
    },
    foto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    jenis: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'individu'
    },
    nama_pj: {
      type: DataTypes.STRING,
      allowNull: true
    },
    no_induk: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'transaction_nasabah',
    freezeTableName: true
  });
};
