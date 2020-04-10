"use strict";

var gulp = require('gulp');
var sass = require('gulp-sass');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');

gulp.task('styles', function () {
	return gulp.src('src/scss/main.scss')
		.pipe(sass()) // Converts Sass to CSS with gulp-sass
		.pipe(rename({ basename: 'rambutan' }))
		.pipe(gulp.dest('dist'))
		.pipe(notify('Rambutan: styles done'));
});

gulp.task('scripts', function () {
	return gulp.src([
			'src/js/polyfills/addeventlistener.js',
			// 'src/js/utils/debounce.js',
			'src/js/main.js'
		])
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'))
		.on('error', notify.onError({
			title: 'JSHint Error',
			message: '<%= error.message %>'
		}))
		.pipe(concat('rambutan.js'))
		.pipe(gulp.dest('dist'))
		.pipe(notify('Rambutan: scripts done'));

});

gulp.task('watch', function () {
	return gulp.watch(['src/scss/**/*.scss', 'src/js/**/*.js'], gulp.series('styles', 'scripts'));
	// Other watchers
});

gulp.task('default', gulp.series('styles', 'scripts', 'watch'));
