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
    copyFromAppDir: [
        './node_modules/**',
        './vendor/**',
        './*.html',
        './migrations/**',
        './helpers/**'
    ],
    react: {
      entry: './app/components/papirus.jsx',
      destFilename: 'papirus.js',
      destDir: './build/'
    }
}

var bowerPaths = [
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
  }
]

// -------------------------------------
// Tasks
// -------------------------------------

gulp.task('clean', function(callback) {
    return destDir.dirAsync('.', { empty: true });
});

gulp.task('copy', ['clean'], function(){

  var copyVendorPromises = bowerPaths.map(function(folder){
    return projectDir.cwd(folder.src).copyAsync('.',
      projectDir.cwd(folder.dest).path(),
      { overwrite: true }
    );
  });

  var copyEssentialPromise = projectDir.copyAsync('app', destDir.path(),{
    overwrite: true,
    matching: paths.copyFromAppDir
  });

  copyVendorPromises.push(copyEssentialPromise);
  return Q.all(copyVendorPromises);
});

// var copyAdminPluginTask = function(){
//   return projectDir.cwd(bowerPaths.plugins.src).copyAsync('.',projectDir.cwd(bowerPaths.plugins.dest).path(), {overwrite: true});
// };

var bundle = function (src, dest) {
    var deferred = Q.defer();

    rollup.rollup({
        entry: src
    }).then(function (bundle) {
        var jsFile = pathUtil.basename(dest);
        var result = bundle.generate({
            format: 'iife',
            sourceMap: true,
            sourceMapFile: jsFile,
        });
        return Q.all([
            destDir.writeAsync(dest, result.code + '\n//# sourceMappingURL=' + jsFile + '.map'),
            destDir.writeAsync(dest + '.map', result.map.toString()),
        ]);
    }).then(function () {
        deferred.resolve();
    }).catch(function (err) {
        console.error(err);
    });

    return deferred.promise;
};

var bundleApplication = function () {
    return Q.all([
        bundle(srcDir.path('background.js'), destDir.path('background.js'))
    ]);
};

var bundleTask = function () {
    return bundleApplication();
};
gulp.task('bundle', ['clean'], bundleTask);
gulp.task('bundle-watch', bundleTask);


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
    gulp.watch(['app/*.js', 'app/electron_boilerplate/*.js'], ['bundle-watch']);
    gulp.watch(['app/components/**/*.jsx', 'app/components/**/*.js'], ['bundle-react-watch']);
    gulp.watch('app/**/*.less', ['less-watch']);
});


gulp.task('build', ['bundle', 'bundle-react' ,'less', 'copy','finalize']);
