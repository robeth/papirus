var Sequelize = originalRequire('sequelize');
var Umzug = originalRequire('umzug');
var jetpack = originalRequire('fs-jetpack');

var modelsDir = jetpack.cwd(__dirname);
var migrationFiles = modelsDir.list('./production');
var dummyMigrationFiles = modelsDir.list('./dummy');

migrationFiles = migrationFiles.sort();
dummyMigrationFiles = dummyMigrationFiles.sort();

var umzug, dummyUmzug;

function setup(databaseParams){
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
      logging : true
    }
  );

  umzug = new Umzug({
    storage: 'sequelize',
    storageOptions: {
      sequelize: sequelize,
    },
    migrations: {
      params: [sequelize.getQueryInterface(), Sequelize],
      path: __dirname + '/production'
    }
  });

  dummyUmzug = new Umzug({
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
}

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
  setup: setup,
  up: up,
  down: down,
  upDummy: upDummy,
  downDummy: downDummy
};
