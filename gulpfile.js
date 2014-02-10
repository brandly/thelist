var
gulp = require('gulp'),
coffee = require('gulp-coffee'),
concat = require('gulp-concat'),
htmlbuild = require('gulp-htmlbuild'),
sass = require('gulp-sass'),
gutil = require('gulp-util'),
uglify = require('gulp-uglify'),
minify = require('gulp-minify-css'),
path = require('path'),
express = require('express'),

build = './build/';

gulp.task('build', function () {
    if (gutil.env.gh) {
        build = '../sc2-gh-pages/'
    }

    // Coffee
    gulp.src('src/scripts/**/*.coffee')
        .pipe(coffee({bare: true}))
        .on('error', gutil.log)
        .pipe(gutil.env.gh ? uglify() : gutil.noop())
        .pipe(concat('app.js'))
        .pipe(gulp.dest(build));

    // Index
    gulp.src('src/index.html')
        .pipe(htmlbuild({
            js: function (files, callback) {
                gulp.src(files)
                    .pipe(gutil.env.gh ? uglify() : gutil.noop())
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
        .pipe(gutil.env.gh ? minify() : gutil.noop())
        .pipe(concat('the.css'))
        .pipe(gulp.dest(build));

    // Icons
    gulp.src('src/styles/icons/*')
        .pipe(gulp.dest(build + 'icons/'));

    gulp.src('src/styles/img/*')
        .pipe(gulp.dest(build + 'img/'));
});

gulp.task('default', function () {
    gulp.run('build');

    if (!gutil.env.gh) {
        gulp.watch(['src/**'], function () {
            gulp.run('build');
        });

        var
        app = express(),
        port = 8888;
        app.use(express.static(path.resolve(build)));
        app.listen(port, function() {
            gutil.log('Listening on', port);
        });
    }
});
