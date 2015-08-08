'use strict';

var gulp = require( 'gulp' );
var sass = require( 'gulp-sass' );
var rename = require( 'gulp-rename' );

gulp.task( 'default', function () {
  
});

gulp.task( 'sass', function () {
  gulp.src( '../www/sass/main.scss' )
      .pipe( sass( { outputStyle: 'compressed' } ).on( 'error', sass.logError ) )
      .pipe( rename( 'main.min.css' ) )
      .pipe( gulp.dest( '../www/css' ) );
});

gulp.task( 'sass:watch', function () {
  gulp.watch( '../www/sass/**/*.scss', ['sass'] );
});