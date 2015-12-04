'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    csso = require('gulp-csso'),
    connect = require('gulp-connect');
    
var bc = './bower_components/';

gulp.task('js', function() {
  gulp.src('builds/development/js/**/*.js')
    //.pipe(concat('app.js'))
    .pipe(gulp.dest('builds/distribution/js/'))
});

gulp.task('sass', function () {
  gulp.src('builds/development/sass/**/*')
      .pipe(sass())
      .pipe(concat('style.min.css'))
      .pipe(csso())
      .pipe(gulp.dest('builds/distribution/css/'));
});

gulp.task('html', function() {
  gulp.src('builds/development/**/*.html')
    .pipe(gulp.dest('builds/distribution/'))
});

gulp.task('connect', function() {
  connect.server({
    port: 35729,
    root: 'builds/distribution',
    livereload: true
  });
});

gulp.task('watch', function() {
  gulp.watch('builds/development/js/**/*.js', ['js']);
  gulp.watch('builds/development/sass/**/*.scss', ['sass']);
  gulp.watch('builds/development/**/*.html', ['html']);
});

gulp.task('libs', function() {
  gulp.src(bc+'jquery/dist/jquery.js')
      .pipe(gulp.dest('./builds/distribution/libs/jquery/'));
});

gulp.task('default', [
  'connect',
  'libs',
  'html',
  'js',
  'sass',
  'watch'
]);
