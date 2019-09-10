const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const autoprefixer = require('autoprefixer');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

module.exports = function (options) {
  return function () {
    return gulp
      .src(options.src)
      .pipe(plugins.if(isDevelopment, plugins.sourcemaps.init()))
      .pipe(plugins.sass())
      .pipe(plugins.concat('style.css'))
      .pipe(plugins.postcss([ autoprefixer() ]))
      .pipe(plugins.cssnano())
      .pipe(plugins.rename({ suffix: '.min' }))
      .pipe(plugins.if(isDevelopment, plugins.sourcemaps.write('.')))
      .pipe(gulp.dest(options.dest))
  }
}
