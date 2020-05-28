var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var fileinclude = require('gulp-file-include');

gulp.task('hello',function(){
    //do 
    console.log('Hello world');
});

gulp.task('move',function(){
    //do
    return gulp.src('index.html') //來源
    .pipe(gulp.dest('dest/')) //目的地
})
gulp.task('movecss',function(){
    //do
    return gulp.src('css/*.css') //來源
    .pipe(gulp.dest('dest/css')) //目的地
})
//壓縮
gulp.task('minicss',function(){
    //do
    return gulp.src('css/*.css') //來源
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dest/css')) //目的地
})
// 合併
gulp.task('concat',function(){
    //do
    return gulp.src('css/*.css') //來源
    .pipe(concat('all.css'))
    .pipe(gulp.dest('dest/css')) //目的地
})
// 合併再壓縮
gulp.task('concat',['sass'],function(){
    //do
    return gulp.src('css/*.css') //來源
    .pipe(concat('all.css'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dest/css')) //目的地
})

gulp.task('sass', function () {
    return gulp.src('./sass/*.scss')//來源
      .pipe(sass().on('error', sass.logError))//sass轉譯
      .pipe(gulp.dest('./css'));//目的地
  });

  gulp.task('watch',function(){
      gulp.watch('./sass/*.scss' ,['sass']);
      gulp.watch('./*.html',['move']);
  })

  gulp.task('sync', function() {
    browserSync.init({
        server: {
            baseDir: "./dest",
            index : "index.html"
        }
    });
    gulp.watch('./*.html' ,['move']).on('change',reload);
 });

 gulp.task('fileinclude', function () {
    gulp.src(['*.html'])
      .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
      }))
      .pipe(gulp.dest('./dest'));
});
   
gulp.task('default', function() {
    browserSync.init({
        server: {
            baseDir: "./dest",
            index : "index.html"
        }
    });
    gulp.watch('./sass/*.scss' ,['concat']).on('change',reload);
    gulp.watch(['./*.html' ,'./**/*.html'] ,['fileinclude']).on('change',reload);
});