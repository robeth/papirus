var app = originalRequire('electron').remote.app;
var jetpack = originalRequire('fs-jetpack');

var DB_CONFIG_NAME = 'papirus-db.json';
var DEFAULT = {
  username: '',
  password: '',
  name: 'papirus',
  host: 'localhost'
};

var dataDir;

function init(){
  dataDir = jetpack.cwd(app.getPath('userData'));
  var dbFile = load();
  if(!dbFile){
    save(DEFAULT);
  }
}

function load(){
  return dataDir.read(DB_CONFIG_NAME, 'json');
}

function save(newConfig){
  return dataDir.write(DB_CONFIG_NAME, newConfig, {atomic: true});
}

init();

module.exports = {
  load: load,
  save: save
};
