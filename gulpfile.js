var
gulp = require('gulp'),
coffee = require('gulp-coffee'),
concat = require('gulp-concat'),
htmlbuild = require('gulp-htmlbuild'),
sass = require('gulp-sass'),
gutil = require('gulp-util'),

build = './build/';

gulp.task('build', function () {
    // Coffee
    gulp.src('src/scripts/**/*.coffee')
        .pipe(coffee({bare: true}))
        .on('error', gutil.log)
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
        .pipe(gulp.dest(build + 'views/'));

    // SASS
    gulp.src('src/styles/**/*.scss')
        .pipe(sass())
        .on('error', gutil.log)
        .pipe(concat('the.css'))
        .pipe(gulp.dest(build));

    // Icons
    gulp.src('src/styles/icons/*')
        .pipe(gulp.dest(build + 'icons/'));

    gulp.src('src/styles/img/*')
        .pipe(gulp.dest(build + 'img/'))
});

gulp.task('default', function () {
    gulp.run('build');

    gulp.watch(['src/**'], function () {
        gulp.run('build');
    });
});

gulp.task('gh', function () {
    gulp.run('build');
    gulp.src('build/**/*')
        .pipe(gulp.dest('../sc2-gh-pages/'))
});
