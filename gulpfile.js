var TaskBuilder = require('gulp-task-builder');

TaskBuilder.task('min')
    .webpack('tinyform.js', false)
    .dest();

TaskBuilder.task('default').depends(['min'])
    .webpack('tinyform.js', false)
    .dest();



