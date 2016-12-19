// 载入外挂
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify'),
    cache = require('gulp-cache'),
    connect = require("gulp-connect"),
    imagemin = require('gulp-imagemin'),
    notify = require('gulp-notify');



// 样式
gulp.task('styles', function () {
    return gulp.src('src/css/*.css')
        //.pipe(concat('index.css'))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css'))
        .pipe(connect.reload())
        .pipe(notify({message: 'Styles task complete'}));
});


// 脚本
gulp.task('scripts', function () {
    return gulp.src('src/js/*.js')
        // .pipe(concat('main.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(connect.reload())
        .pipe(notify({message: 'Scripts task complete'}));
});

// 图片
gulp.task('images', function () {
    return gulp.src('src/img/**/*')
        .pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
        .pipe(gulp.dest('dist/img'))
        .pipe(connect.reload())
        .pipe(notify({message: 'Images task complete'}));
});

//定义html任务
gulp.task('html', function () {
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});

//定义看守任务
gulp.task('watch', function () {
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/js/*.js', ['scripts']);
    gulp.watch('src/css/*.css', ['styles']);
    gulp.watch('src/img/*', ['images']);
});

//定义livereload任务
gulp.task('connect', function () {
    connect.server({
        root: 'dist',
        livereload: true
    });
});

// 清理
gulp.task('clean', function () {
    return gulp.src(['dist/*'], {read: false})
        .pipe(clean());
});


// 预设任务
gulp.task('default', ['clean'], function () {
    gulp.start('styles', 'scripts', 'images', 'watch','html');
});

