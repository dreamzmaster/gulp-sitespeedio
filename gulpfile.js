/**
 * gulp-sitespeed.io (http://www.sitespeed.io)
 */
'use strict';

var gulp = require('gulp'),
		getUrl = require('./tasks/getUrl'),
    argv = require('yargs').argv,
		end = require('stream-end'),
		runSequence = require('run-sequence'),
		sitespeedConfig,
		sitespeedio = require('./tasks/sitespeed.js');


gulp.task('sitespeedio', function (done) {
  return sitespeedio(sitespeedConfig)(done);
});

gulp.task('performance', function(done) {
	return gulp.src('tasks/data/' + argv.txtPath, {buffer: false})
  .pipe(getUrl()
  .on('data', function(res) {
    sitespeedConfig = {
      urls: res,
			browser: 'firefox',
      depth: 1,
      outputFolder: 'dist/',
			browsertime: {
				connectivity: 'cable',
				iterations: 5,
			}
    };
  })
  .on('end', function(res) {
    end(done);
  }));
});

gulp.task('build', function(callback) {
  runSequence('performance', 'sitespeedio', callback);
});
