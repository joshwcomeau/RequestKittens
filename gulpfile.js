var gulp          = require('gulp'),
    sass          = require('gulp-sass'),
    autoprefixer  = require('gulp-autoprefixer'),
    minifycss     = require('gulp-minify-css'),
    jshint        = require('gulp-jshint'),
    uglify        = require('gulp-uglify'),
    imagemin      = require('gulp-imagemin'),
    rename        = require('gulp-rename'),
    concat        = require('gulp-concat'),
    notify        = require('gulp-notify'),
    cache         = require('gulp-cache'),
    sourcemaps    = require('gulp-sourcemaps');

function errorLog (error) {
  console.error(error.message); 
  this.emit('end');
}

gulp.task('default', function() {
    gulp.start('styles', 'scripts', 'watch');
});

gulp.task('styles', function() {
  return gulp.src('public/assets/scss/*.scss')
    .pipe(sourcemaps.init())
      .pipe(sass())
      .on('error', errorLog)
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
      .pipe(minifycss())
      .pipe(concat('style.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('public/'))
    .pipe(notify({ message: 'Styles task complete' }));
});


gulp.task('scripts', function() {
  return gulp.src(['public/assets/js/init.js', 'public/assets/js/**/*.model.js', 'public/assets/js/**/*.collection.js', 'public/assets/js/**/*.view.js', 'public/assets/js/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(sourcemaps.init())
      .pipe(concat('app.js'))
      .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .on('error', errorLog)
    .pipe(gulp.dest('public/'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('watch', ['styles', 'scripts'], function() {
  gulp.watch('public/**/*.js', ['scripts']);
  gulp.watch('public/**/*.scss', ['styles']);
});