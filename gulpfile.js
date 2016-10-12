var gulp          = require('gulp');
var webpack       = require('webpack');
var webpackConfig = require('./webpack.config.js');

gulp.task('default', ['webpack']);
gulp.task('webpack', function(callback) {
    // run webpack
    webpack(webpackConfig, function(err, stats) {
        callback();
    });
});
