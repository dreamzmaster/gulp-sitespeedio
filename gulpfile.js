/**
 * gulp-sitespeed.io (http://www.sitespeed.io)
 */
'use strict';

var gulp = require('gulp'),
	sitespeedio = require('./tasks/sitespeed.js');

gulp.task('build', sitespeedio({
	urls: ['https://www.sitespeed.io', 'https://www.sitespeed.io/faq/'],
	browser: 'firefox',
	depth: 0,
	browsertime: {
		connectivity: 'cable',
		iterations: 5,
	}
}));