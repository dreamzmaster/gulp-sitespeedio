/**
 * gulp-sitespeed.io (http://www.sitespeed.io)
 */
'use strict';

var gulp = require('gulp'),
  sitespeedio = require('./tasks/sitespeed.js');

gulp.task('build', sitespeedio({
  urls: ['https://www.sitespeed.io', 'https://www.sitespeed.io/faq/'],
  depth: 0,
  browsertime: {
    browser: 'chrome',
    connectivity: {
      profile: 'cable'
    },
    iterations: 1,
  }
}));