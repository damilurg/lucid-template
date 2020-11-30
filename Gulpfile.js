const gulp = require('gulp'),
    connect = require('gulp-connect'),
    sass = require('gulp-sass'),
    pug = require('gulp-pug'),
    plumber = require('gulp-plumber'),
    include = require('gulp-include'),
    uglify = require('gulp-uglify'),
    csso = require('gulp-csso'),
    del = require('del'),
    webServerPort = 8080,
    autoprefixer = require('gulp-autoprefixer');

gulp.task('styles', function () {
    return gulp.src('assets/scss/cannon.scss')
        .pipe(sass({
            outputStyle: 'nested',
            precision: 10,
            includePaths: ['node_modules'],
            onError: console.error.bind(console, 'Sass error:')
        }))
        .pipe(include())
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(csso())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('scripts', function () {
    return gulp.src('assets/scripts/*.js')
        .pipe(include())
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('clean', function () {
    return del(['dist']);
});

gulp.task('build', gulp.series(['clean', 'styles', 'scripts']));

gulp.task('server', function (done) {
    connect.server({
        livereload: false,
        port: webServerPort
    });
    done();
});

gulp.task('livereload', function () {
    return gulp.src('*.html').pipe(connect.reload());
});

gulp.task('watch', function (done) {
    connect.server({
        livereload: true,
        port: webServerPort
    });
    gulp.watch('assets/scripts/*.js', gulp.series(['build', 'livereload']));
    gulp.watch('assets/scss/**/*.scss', gulp.series(['build', 'livereload']));
    gulp.watch('*.html', gulp.series('livereload'));
    done();
});
