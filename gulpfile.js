/**
 * gulp-sitespeed.io (http://www.sitespeed.io)
 */
'use strict';

const gulp = require('gulp');
const sitespeedio = require('./tasks/sitespeed.js');

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
