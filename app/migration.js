var Sequelize = require('sequelize');
var Umzug = require('umzug');
var jetpack = require('fs-jetpack');

var modelsDir = jetpack.cwd(__dirname);
var migrationFiles = modelsDir.list('migrations/');
migrationFiles = migrationFiles.sort();

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


function up(){
  umzug.execute({
    migrations: migrationFiles.sort(),
    method: 'up'
  }).then(function(migrations){
    console.log("migrations finished");
    console.log(migrations);
  }).catch(function(error){
    console.log(error);
  });
}

function down(){
  umzug.execute({
    migrations: migrationFiles.sort().reverse(),
    method: 'down'
  }).then(function(migrations){
    console.log("migrations finished");
    console.log(migrations);
  }).catch(function(error){
    console.log(error);
  });
}

module.exports = {
  up: up,
  down: down
}
