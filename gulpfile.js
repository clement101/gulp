var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var fileinclude = require('gulp-file-include');
var imagemin = require('gulp-imagemin');
var gutil = require( 'gulp-util' );
var ftp = require( 'vinyl-ftp' );
var connect = require('gulp-connect-php');
var reload = browserSync.reload;

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
// 壓圖
gulp.task('miniimg',function(){
    gulp.src('./images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dest/images'))
});
// ftp
gulp.task( 'ftp',['miniimg'], function () {
 
    var conn = ftp.create( {
        host:     '140.115.236.71',
        user:     '%ed101+',
        password: '!654=stu&',
        parallel: 10
    } );
 
    var globs = [
        'dest/**',
        'dest/css/**',
        'dest/images/**',
        'index.html'
    ];
 
    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance
 
    return gulp.src( globs, { base: '.', buffer: false } )
        .pipe( conn.newer( '/T2000277' ) ) // only upload newer files
        .pipe( conn.dest( '/T2000277' ) );
 
} );
// 同步
gulp.task('default', function() {
    browserSync.init({
        server: {
            baseDir: "./dest",
            index : "index.html"
        }
    });
    gulp.watch('./dev/sass/*.scss' ,['sass']).on('change',reload);
    gulp.watch(['./dev/*.html' ,'./dev/**/*.html'] ,['fileinclude']).on('change',reload);
});

//php
gulp.task('php', function () {
  connect.server({
    base: './php',
    port: 8010,
    keepalive: true
  });
});


gulp.task('browserSync',['php'], function() {
  browserSync.init({
      //proxy:"localhost:8010",
      baseDir: "./php",
      open:true,
      notify:false

  });
});


gulp.task('devphp', [ 'browserSync'], function() {
  gulp.watch('./php/*.php', browserSync.reload);
});


// 預設
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