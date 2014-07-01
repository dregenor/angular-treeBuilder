var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    sequence = require('run-sequence');

gulp.task('browserify', function () {
    return gulp.src('index.js')
        .pipe(browserify({
            insertGlobals: true,
            debug: false
        }))
        .pipe(uglify({
            compress:{
                sequences     : true,  // join consecutive statemets with the “comma operator”
                properties    : true,  // optimize property access: a["foo"] → a.foo
                dead_code     : true,  // discard unreachable code
                drop_debugger : true,  // discard “debugger” statements
                unsafe        : true, // some unsafe optimizations (see below)
                conditionals  : true,  // optimize if-s and conditional expressions
                comparisons   : true,  // optimize comparisons
                evaluate      : true,  // evaluate constant expressions
                booleans      : true,  // optimize boolean expressions
                loops         : true,  // optimize loops
                unused        : true,  // drop unused variables/functions
                hoist_funs    : true,  // hoist function declarations
                hoist_vars    : false, // hoist variable declarations
                if_return     : true,  // optimize if-s followed by return/continue
                join_vars     : true,  // join var declarations
                cascade       : true,  // try to cascade `right` into `left` in sequences
                side_effects  : true,  // drop side-effect-free statements
                warnings      : true   // warn about potentially dangerous optimizations/code
            }
        }))
        .pipe(rename('tree-builder.min.js'))
        .pipe(gulp.dest('./assets'));
});

gulp.task('prepareTest',function(){
    return gulp.src('assets/tree-builder.min.js')
        .pipe(gulp.dest('./test'));
});

gulp.task('default',function(cb){
    sequence('browserify','prepareTest',cb)
});