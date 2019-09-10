const gulp = require('gulp');

function lazyRequireTask(taskName, options){
  options = options || {};
  options.taskName = taskName;
  gulp.task(taskName, function (callback) {
    let task = require(`./tasks/${taskName}`).call(this, options);
    return task(callback);
  })
}

lazyRequireTask(
  'clean',
  {
    src: ['build/**', '!build'],
  }
);

lazyRequireTask(
  'copy',
  {
    src: 'public/**',
    dest: 'build',
  }
);

lazyRequireTask(
  'styles',
  {
    src: 'src/styles/*.scss',
    dest: 'build',
  }
);

lazyRequireTask(
  'watch',
  {
    styles: 'src/styles/*.*',
    copy: 'public/**/*.*',
  }
);

lazyRequireTask('serve');
lazyRequireTask('default');
