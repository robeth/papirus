var Sequelize = require('sequelize');
var nasabahDescription = require('./transaction_nasabah');
var sequelizeMetaDescription = require('./sequelize-meta');
var Umzug = require('umzug');

var jetpack = require('fs-jetpack');
var modelsDir = jetpack.cwd(__dirname);
var migrationFiles = modelsDir.list('migrations/');
console.log('migrations files: ' + migrationFiles.sort() );

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
var SequelizeMeta = sequelize.import('SequelizeMeta', sequelizeMetaDescription);



Nasabah
  .drop()
  .then(function(result){
    console.log('Nasabah drop result: ' + result);
  });

SequelizeMeta
  .drop()
  .then(function(result){
    console.log('SequelizeMeta drop result:' + result);
  });

var umzug = new Umzug({
  storage: 'sequelize',
  storageOptions: {
    sequelize: sequelize,
  },
  migrations: {
    params: [sequelize.getQueryInterface(), Sequelize],
    path: __dirname + '/migrations'
  }
});

console.log('Execute migrations');

umzug.execute({
  migrations: migrationFiles,
  method: 'up'
}).then(function(migrations){
  console.log("migrations finished");
  console.log(migrations);
}).catch(function(error){
  console.log(error);
});




module.exports = {
  Nasabah: Nasabah
}
