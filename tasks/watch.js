const gulp = require('gulp');

module.exports = function (options) {
  return function () {
    for (let key in options) {
      key !== 'taskName' && gulp.watch(options[key], gulp.series(key))
    }
  }
}
