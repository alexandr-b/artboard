const browserSync = require('browser-sync').create();

module.exports = function () {
  return function () {
    browserSync.init({
      server: 'build',
    });

    browserSync
      .watch('build/**/*.*')
      .on('change', browserSync.reload)
  }
}
