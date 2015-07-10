var gulp = require('gulp');
var plug = require('gulp-load-plugins')();
var rename = require("gulp-rename");

var source = [
    "./src/client/app/**/*module*.js",
    "./src/client/app/**/*.js"
];

gulp.task('ngAnnotateTest', function () {
    return gulp
        .src(source)
        .pipe(plug.ngAnnotate({add: true, single_quotes: true}))
        .pipe(rename(function (path) {
            path.extname = '.annotated.js';
        }))
        .pipe(plug.uglify({mangle: true}))
        .pipe(gulp.dest('./build'));
});

gulp.task('hint', function () {
    return gulp
        .src(source)
        .pipe(plug.jshint('./.jshintrc'))
        .pipe(plug.jshint.reporter('jshint-stylish'))
});