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
var generateSpecsImportFile = require('./generate_specs_import');

var projectDir = jetpack;
var srcDir = projectDir.cwd('./app');
var destDir = projectDir.cwd('./build');
var bowerSrcDir = projectDir.cwd('./bower_components');
var bowerDestDir = projectDir.cwd('./build/vendor/');

var paths = {
    copyFromAppDir: [
        './node_modules/**',
        './vendor/**',
        './**/*.html'
    ],
    react: {
      entry: './app/components/bina-mandiri.jsx',
      destFilename: 'bina-mandiri.js',
      destDir: './build/'
    }
}

var bowerPaths = {
  plugins: {
    src: './bower_components/admin-lte/plugins',
    dest: './build/plugins'
  },
  js: {
    src: './bower_components/admin-lte/dist/js',
    dest: './build/js'
  },
  css: {
    src: './bower_components/admin-lte/dist/css',
    dest: './build/css'
  },
  img: {
    src: './bower_components/admin-lte/dist/img',
    dest: './build/img'
  },
  bootstrap: {
    src: './bower_components/admin-lte/bootstrap',
    dest: './build/plugins/bootstrap'
  },
  fa: {
    src: './vendor/font-awesome/',
    dest: './build/plugins/font-awesome'
  }
}

// -------------------------------------
// Tasks
// -------------------------------------

gulp.task('clean', function(callback) {
    return destDir.dirAsync('.', { empty: true });
});

var copyAdminPluginTask = function(){
  return projectDir.cwd(bowerPaths.plugins.src).copyAsync('.',projectDir.cwd(bowerPaths.plugins.dest).path(), {overwrite: true});
};

var copyAdminJsTask = function(){
  return projectDir.cwd(bowerPaths.js.src).copyAsync('.',projectDir.cwd(bowerPaths.js.dest).path(), {overwrite: true});
};

var copyAdminCssTask = function(){
  return projectDir.cwd(bowerPaths.css.src).copyAsync('.',projectDir.cwd(bowerPaths.css.dest).path(), {overwrite: true});
};

var copyAdminImgTask = function(){
  return projectDir.cwd(bowerPaths.img.src).copyAsync('.',projectDir.cwd(bowerPaths.img.dest).path(), {overwrite: true});
};

var copyAdminBootstrapTask = function(){
  return projectDir.cwd(bowerPaths.bootstrap.src).copyAsync('.',projectDir.cwd(bowerPaths.bootstrap.dest).path(), {overwrite: true});
};

var copyAdminFaTask = function(){
  return projectDir.cwd(bowerPaths.fa.src).copyAsync('.',projectDir.cwd(bowerPaths.fa.dest).path(), {overwrite: true});
};

var copyTask = function () {
    return projectDir.copyAsync('app', destDir.path(), {
        overwrite: true,
        matching: paths.copyFromAppDir
    });
};

gulp.task('copy-admin-plugin', ['clean'], copyAdminPluginTask);
gulp.task('copy-admin-bootstrap', ['copy-admin-plugin'],copyAdminBootstrapTask);
gulp.task('copy-admin-fa', ['copy-admin-bootstrap'],copyAdminFaTask);
gulp.task('copy-admin-js', ['copy-admin-fa'],copyAdminJsTask);
gulp.task('copy-admin-css', ['copy-admin-js'], copyAdminCssTask);
gulp.task('copy-admin-img', ['copy-admin-css'], copyAdminImgTask);
gulp.task('copy-admin', ['copy-admin-img']);

gulp.task('copy', ['copy-admin'], copyTask);
gulp.task('copy-watch', copyTask);

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
        bundle(srcDir.path('background.js'), destDir.path('background.js')),
        bundle(srcDir.path('app.js'), destDir.path('app.js')),
    ]);
};

var bundleSpecs = function () {
    generateSpecsImportFile().then(function (specEntryPointPath) {
        return Q.all([
            bundle(srcDir.path('background.js'), destDir.path('background.js')),
            bundle(specEntryPointPath, destDir.path('spec.js')),
        ]);
    });
};

var bundleTask = function () {
    if (utils.getEnvName() === 'test') {
        return bundleSpecs();
    }
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
    gulp.watch('app/**/*.js', ['bundle-watch']);
    gulp.watch('app/**/*.jsx', ['bundle-react-watch']);
    gulp.watch(paths.copyFromAppDir, { cwd: 'app' }, ['copy-watch']);
    gulp.watch('app/**/*.less', ['less-watch']);
});


gulp.task('build', ['bundle', 'bundle-react' ,'less', 'copy','finalize']);
