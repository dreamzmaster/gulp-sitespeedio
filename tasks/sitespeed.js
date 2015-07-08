/*
 * gulp-sitespeedio
 * Released under the Apache 2.0 License
 */

'use strict';

var gulp = require('gulp'),
	Sitespeed = require('sitespeed.io/lib/sitespeed'),
	fs = require('fs'),
	path = require('path'),
	gutil = require('gulp-util'),
	budget = require('./lib/budget'),
	assign = require('object-assign'),
	tmp = require('temporary'),
	PluginError = gutil.PluginError;

var PLUGIN_NAME = 'gulp-sitespeedio';

var gulpSitespeedio = function(options) {

	gutil.log('Analyze your sites web performance');

	if (!options.url && !options.urls) {
		throw new PluginError(PLUGIN_NAME, 'Missing url option to Analyse');
	}

	var dir = new tmp.Dir(),
		config = {
			resultBaseDir: dir.path,
			html: true,
            showFailedOnly: false
		};

	assign(config, options);

	// special handling for reading file with urls
	// in sitespeed.io we read the file within the cli,
	// so we need to do it from outside when we run without the
	// cli
	if (config.file) {
		readFile(config);
	}

	return function(cb) {
		
		var sitespeed = new Sitespeed(),
			build = this;

		sitespeed.run(options, function(err, data) {

			if (err) {
				cb(new gutil.PluginError(PLUGIN_NAME, err + '\n\n'));
				
			} else if (data && data.budget) {

				var isFailing = budget.checkBudget(data, gutil, config);

                if(isFailing) {
                    cb(new gutil.PluginError(PLUGIN_NAME, 'FAILED BUDGETS'));   
                } else {
                	cb();
                }
			} else {
                cb();
            }
		});
	}

};

function readFile(options) {

	// absoulute or relative
	var fullPathToFile = (options.file.charAt(0) === path.sep) ? options.file : path.join(process.cwd(),
		path.sep, options.file);

	var data = fs.readFileSync(fullPathToFile);
	var urls = data.toString().split(EOL);
	urls = urls.filter(function(l) {
		return l.length > 0;
	});
    
	// we clean the file in the config to make
	// it look that we are feeding with URL array
	options.urls = urls;
	options.file = undefined;
}

module.exports = gulpSitespeedio;
