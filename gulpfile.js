var TaskBuilder = require('gulp-task-builder');
var css2js = require("gulp-css2js");


TaskBuilder.task('css')
    .src('../css/tinyform.css')
    .subTask(css2js({
        splitOnNewline: false
    }))
    .dest('./bin/full');

TaskBuilder.task('min')
    .webpack('tinyform.js', true)
    .dest('./bin/min');

TaskBuilder.task('default')
    .depends(['min', 'css'])
    .webpack('tinyform.js', false)
    .dest('./bin/full');



