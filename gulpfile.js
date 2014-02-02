var
gulp = require('gulp'),
coffee = require('gulp-coffee'),
concat = require('gulp-concat'),
htmlbuild = require('gulp-htmlbuild');

build = './build/'

gulp.task('build', function () {
    // Coffee
    gulp.src('src/scripts/**/*.coffee')
        .pipe(coffee({bare: true}))
        .pipe(concat('app.js'))
        .pipe(gulp.dest(build));

    // Index
    gulp.src('src/index.html')
        .pipe(htmlbuild({
            js: function (files, callback) {
                gulp.src(files)
                    .pipe(concat('lib.js'))
                    .pipe(gulp.dest(build));
                callback(null, ['lib.js']);
            }
        }))
        .pipe(gulp.dest(build));

    // Views
    gulp.src('src/views/*.html')
        .pipe(gulp.dest(build + 'views/'))
});

gulp.task('default', function () {
    gulp.run('build');

    gulp.watch(['src/**'], function () {
        gulp.run('build');
    });
});
