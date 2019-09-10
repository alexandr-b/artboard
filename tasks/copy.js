const gulp = require('gulp');

module.exports = function (options) {
  return function () {
    return gulp
      .src(options.src, { since: gulp.lastRun('copy') })
      .pipe(gulp.dest(options.dest))
  }
}
