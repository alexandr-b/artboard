const gulp = require('gulp');

module.exports = function () {
  const series = ['clean', gulp.parallel('copy', 'styles')];

  process.env.NODE_ENV !== 'production'
    && series.push(gulp.parallel('watch', 'serve'));

  return gulp.series(series);
}
