var Sequelize = require('sequelize');
var Umzug = require('umzug');
var jetpack = require('fs-jetpack');
var config = require('../vendor/electron_boilerplate/db_config');
var _ = require('lodash');

var modelsDir = jetpack.cwd(__dirname);
var migrationFiles = modelsDir.list('./production');
migrationFiles = migrationFiles.sort();
var dummyMigrationFiles = modelsDir.list('./dummy');
dummyMigrationFiles = dummyMigrationFiles.sort();

if(_.isEmpty(config)){
  config = window.env;
}
var databaseParams = config.load();
console.log(databaseParams);
var sequelize = new Sequelize(
  databaseParams.name,
  databaseParams.username,
  databaseParams.password,
  {
    host: databaseParams.host,
    diaclect: 'mysql',
    define: {
      timestamps: false
    },
    logging : !databaseParams
  }
);
var umzug = new Umzug({
  storage: 'sequelize',
  storageOptions: {
    sequelize: sequelize,
  },
  migrations: {
    params: [sequelize.getQueryInterface(), Sequelize],
    path: __dirname + '/production'
  }
});

var dummyUmzug = new Umzug({
  storage: 'sequelize',
  storageOptions: {
    sequelize: sequelize,
    modelName: 'DummyMigration'
  },
  migrations: {
    params: [sequelize.getQueryInterface(), Sequelize],
    path: __dirname + '/dummy'
  }
});

function up(){
  return umzug.execute({
    migrations: migrationFiles.slice().sort(),
    method: 'up'
  })
}

function down(){
  return umzug.execute({
    migrations: migrationFiles.slice().sort().reverse(),
    method: 'down'
  });
}

function upDummy(){
  return dummyUmzug.execute({
    migrations: dummyMigrationFiles.slice(),
    method: 'up'
  });
}

function downDummy(){
  return dummyUmzug.execute({
    migrations: dummyMigrationFiles.slice().sort().reverse(),
    method: 'down'
  });
}

module.exports = {
  up: up,
  down: down,
  upDummy: upDummy,
  downDummy: downDummy
};
