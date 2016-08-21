'use strict';

var pathUtil = require('path');
var Q = require('q');
var gulp = require('gulp');
var rollup = require('rollup');
var less = require('gulp-less');
var jetpack = require('fs-jetpack');

// For react build purpose
var browserify = require('browserify');
var reactify = require('reactify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');

var utils = require('./utils');

var projectDir = jetpack;
var srcDir = projectDir.cwd('./app');
var destDir = projectDir.cwd('./build');
var bowerSrcDir = projectDir.cwd('./bower_components');
var bowerDestDir = projectDir.cwd('./build/vendor/');

var paths = {
  static: [
    './node_modules/**',
    './views/**',
    './electron_boilerplate/**',
    './background.js',
    './bina-mandiri.html'
  ],
  react: {
    entry: './app/js/components/papirus.jsx',
    destFilename: 'papirus.js',
    destDir: './build/'
  },
  bower: [
    {
      src: './bower_components/admin-lte/plugins',
      dest: './build/plugins'
    },
    {
      src: './bower_components/admin-lte/dist/js',
      dest: './build/js'
    },
    {
      src: './bower_components/admin-lte/dist/css',
      dest: './build/css'
    },
    {
      src: './bower_components/admin-lte/dist/img',
      dest: './build/img'
    },
    {
      src: './bower_components/admin-lte/bootstrap',
      dest: './build/plugins/bootstrap'
    },
    {
      src: './vendor/font-awesome/',
      dest: './build/plugins/font-awesome'
    },
    {
      src: './bower_components/bootstrap-daterangepicker',
      dest: './build/plugins/bootstrap-daterangepicker'
    },
    {
      src: './app/node_modules/react-bootstrap-table/css',
      dest: './build/plugins/react-bootstrap-table/css'
    }
  ]
}


// -------------------------------------
// Tasks
// -------------------------------------

gulp.task('clean', function(callback) {
    return destDir.dirAsync('.', { empty: true });
});

gulp.task('copy', ['clean'], function(){
  var copyBowerPromise = paths.bower.map(function(folder){
    return projectDir.cwd(folder.src).copyAsync('.',
      projectDir.cwd(folder.dest).path(),
      { overwrite: true }
    );
  });

  var copyStaticPromise = projectDir.copyAsync('app', destDir.path(),{
    overwrite: true,
    matching: paths.static
  });

  return Q.all([copyBowerPromise, copyStaticPromise]);
});

var lessTask = function () {
    return gulp.src('app/stylesheets/main.less')
    .pipe(less())
    .pipe(gulp.dest(destDir.path('stylesheets')));
};
gulp.task('less', ['clean'], lessTask);
gulp.task('less-watch', lessTask);


gulp.task('finalize', ['clean'], function () {
    var manifest = srcDir.read('package.json', 'json');
    // Add "dev" or "test" suffix to name, so Electron will write all data
    // like cookies and localStorage in separate places for each environment.
    switch (utils.getEnvName()) {
        case 'development':
            manifest.name += '-dev';
            manifest.productName += ' Dev';
            break;
        case 'test':
            manifest.name += '-test';
            manifest.productName += ' Test';
            break;
    }
    destDir.write('package.json', manifest);

    var configFilePath = projectDir.path('config/env_' + utils.getEnvName() + '.json');
    destDir.copy(configFilePath, 'env_config.json');
});

var bundleReact = function(){
  return browserify({
      debug: true,
      entries: paths.react.entry,
      extensions: ['.js', '.jsx'],
      transform: [reactify]
    })
    .bundle()
    .pipe(source(paths.react.destFilename))
    .pipe(gulp.dest(paths.react.destDir));
};

// Bundle react components
gulp.task('bundle-react', ['clean'], bundleReact);
gulp.task('bundle-react-watch', bundleReact);

gulp.task('watch', function () {
    // gulp.watch(['app/electron/**/*'], ['bundle-electron-watch']);
    gulp.watch(['app/js/**/*'], ['bundle-react-watch']);
    gulp.watch('app/**/*.less', ['less-watch']);
});

gulp.task('build', ['bundle-react' ,'less', 'copy','finalize']);
