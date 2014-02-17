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

build = gutil.env.gh ? './gh-pages/' : './build/';

// don't minify/uglify unless we're heading to github
if (!gutil.env.gh) {
    uglify = gutil.noop;
    minify = gutil.noop;
}

gulp.task('build', function () {

    // Coffee
    gulp.src('src/scripts/**/*.coffee')
        .pipe(coffee({bare: true}))
        .on('error', gutil.log)
        .pipe(uglify())
        .pipe(concat('app.js'))
        .pipe(gulp.dest(build));

    // Index
    gulp.src('src/index.html')
        .pipe(htmlbuild({
            js: function (files, callback) {
                gulp.src(files)
                    .pipe(uglify())
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
        .pipe(minify())
        .pipe(concat('the.css'))
        .pipe(gulp.dest(build));

    // Icons
    gulp.src('src/styles/icons/*')
        .pipe(gulp.dest(build + 'icons/'));

    // Images
    gulp.src('src/styles/img/*')
        .pipe(gulp.dest(build + 'img/'));

    // Favicons
    gulp.src('src/styles/favicons/*')
        .pipe(gulp.dest(build));
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
