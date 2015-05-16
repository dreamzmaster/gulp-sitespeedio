/**
 * gulp-sitespeed.io (http://www.sitespeed.io)
 */
'use strict';

var gulp 		= require('gulp'),
	sitespeedio = require('./tasks/sitespeed.js');

gulp.task('build', sitespeedio({
	url: 'http://127.0.0.1',
	depth: 0,
	budget: {
		page: {
            image: 10,
            css: 1,
            requests: 7,
            pageWeight:300000,
            jsWeight: 0
        }
	}
}));