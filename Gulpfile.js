var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    sequence = require('run-sequence');

gulp.task('browserify', function () {
    return gulp.src('index.js')
        .pipe(browserify({
            insertGlobals: true,
            debug: true
        }))
        //.pipe(uglify())
        .pipe(rename('tree-builder.min.js'))
        .pipe(gulp.dest('./assets'));
});

gulp.task('prepareTest',function(){
    return gulp.src('assets/tree-builder.min.js')
        .pipe(gulp.dest('./test'));
});

gulp.task('default',function(cb){
    sequence(['browserify','prepareTest'],cb)
});