var Sequelize = require('sequelize');
var Umzug = require('umzug');
var jetpack = require('fs-jetpack');
var config = require('./vendor/electron_boilerplate/env_config');
var _ = require('lodash');

var modelsDir = jetpack.cwd(__dirname);
var migrationFiles = modelsDir.list('migrations/production');
migrationFiles = migrationFiles.sort();
var dummyMigrationFiles = modelsDir.list('migrations/dummy');
dummyMigrationFiles = dummyMigrationFiles.sort();


if(_.isEmpty(config)){
  config = window.env;
}

function Migration(){
  var databaseParams = config.database;
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
      path: __dirname + '/migrations/production'
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
      path: __dirname + '/migrations/dummy'
    }
  });

  this.sequelize = sequelize;
  this.umzug = umzug;
  this.dummyUmzug = dummyUmzug;
}

Migration.prototype.up = function(){
  return this.umzug.execute({
    migrations: migrationFiles.slice().sort(),
    method: 'up'
  })
}

Migration.prototype.down = function(){
  return this.umzug.execute({
    migrations: migrationFiles.slice().sort().reverse(),
    method: 'down'
  });
}

Migration.prototype.upDummy = function(){
  return this.dummyUmzug.execute({
    migrations: dummyMigrationFiles.slice(),
    method: 'up'
  });
}

Migration.prototype.downDummy = function(){
  return this.dummyUmzug.execute({
    migrations: dummyMigrationFiles.slice().sort().reverse(),
    method: 'down'
  });
}

module.exports = new Migration();
