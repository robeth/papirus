var Sequelize = require('sequelize');
var Umzug = require('umzug');
var jetpack = require('fs-jetpack');

var modelsDir = jetpack.cwd(__dirname);
var migrationFiles = modelsDir.list('migrations/production');
migrationFiles = migrationFiles.sort();
var dummyMigrationFiles = modelsDir.list('migrations/dummy');
dummyMigrationFiles = dummyMigrationFiles.sort();

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
    path: __dirname + '/migrations/production'
  }
});


function up(){
  return umzug.execute({
    migrations: migrationFiles.sort(),
    method: 'up'
  })
}

function down(){
  return umzug.execute({
    migrations: migrationFiles.sort().reverse(),
    method: 'down'
  }).then(function(migrations){
    console.log("migrations finished");
    console.log(migrations);
  }).catch(function(error){
    console.log(error);
  });
}

var dummyUmzug = new Umzug({
  storage: 'sequelize',
  storageOptions: {
    sequelize: sequelize,
    modelName: 'DummyMigration'
  },
  migrations: {
    params: [sequelize.getQueryInterface(), Sequelize],
    path: __dirname + '/migrations/dummy'
  }
});

function upDummy(){
  console.log('Dummy Migrations started');
  console.log(dummyMigrationFiles);
  return dummyUmzug.execute({
    migrations: dummyMigrationFiles,
    method: 'up'
  });
}

module.exports = {
  up: up,
  down: down,
  upDummy: upDummy,
}
