"use strict";

const {src, dest, series, watch} = gulp;
import gulp from 'gulp';
import pug from 'gulp-pug';
import browserSync from 'browser-sync';
import autoprefixer from 'gulp-autoprefixer';
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import newer from 'gulp-newer';
import del from 'del';
import babel from 'gulp-babel';
import cleanCSS from 'gulp-clean-css';
import sass from 'gulp-dart-sass';
import uglify from 'gulp-uglify';


const pugs = () => {
    return src('src/pug/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(dest('dist'));
};

const style =() => {
    return src('src/sass/*.sass')
        .pipe(sass({outputStyle: 'expanded'})) // С помошью плагина файл будет преобразован ( Для сжатия файла)
        .pipe(cleanCSS({level: 2}))
        .pipe(autoprefixer({
            grid: true,
            overrideBrowserslist: ['last 10 version']})) // Префиксы для оптимизации CSS 
        .pipe(dest('dist'));
    };

const scripts = () => {
    return src('src/js/script.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(dest('dist'));
};

const fonts = () => {
    return src('src/assets/fonts/**/*.*')
        .pipe(dest('dist/assets/font'));
};

const images = () => {
    return src('src/assets/images/**/*.*')
        .pipe(newer('dist/assets/'))
        .pipe(imagemin())
        .pipe(webp())
        .pipe(dest('dist/assets/images'));
};

const clean = () => {
    return del('dist');
};

const watching = () => {
    browserSync.init({
        server: {baseDir: "dist"}, // На какой папке будет запущен сервер
        notify: false, // Убирает уведомление
        online: true // Для офлайн работы сервера
    });

    watch(['src/pug/**/*.pug'], pugs).on('change', browserSync.reload); 
    watch(['src/sass/**/*.sass'], style).on('change', browserSync.reload); 
    watch(['src/js/**/*.js'], scripts).on('change', browserSync.reload);
    watch(['src/assets/images/**/*'], images);
};

export default series (pugs, style, scripts, fonts, images,  watching, clean);