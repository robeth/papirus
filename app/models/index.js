var Sequelize = require('sequelize');
var nasabahDescription = require('./transaction_nasabah');

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

var Nasabah = sequelize.import('transaction_nasabah', nasabahDescription);

Nasabah
  .sync()
  .then(function onSuccess(success){
    console.log("Nasabah table created successfully");
  })
  .catch(function onFailed(error){
    console.log("Nasabah table wasn't created successfully")
  });


module.exports = {
  Nasabah: Nasabah
}
