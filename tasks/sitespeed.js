'use strict';

const Sitespeed = require('sitespeed.io/lib/sitespeed');
const fs = require('fs');
const path = require('path');
const gutil = require('gulp-util');
const budget = require('./lib/budget');
const assign = require('object-assign');
const tmp = require('temporary');

const PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-sitespeedio';

const readFile = (options) => {
  // absoulute or relative
  const joinedPath = path.join(process.cwd(), path.sep, options.file);
  const fullPathToFile = (options.file.charAt(0) === path.sep) ? options.file : joinedPath;

  const data = fs.readFileSync(fullPathToFile);
  let urls = data.toString().split('\n');
  urls = urls.filter(l => l.length > 0);

  // we clean the file in the config to make
  // it look that we are feeding with URL array
  options.urls = urls;
  options.file = undefined;
};

const gulpSitespeedio = (options) => {
  if (!options.url && !options.urls) {
    throw new PluginError(PLUGIN_NAME, 'Missing url option to Analyse');
  }

  const dir = new tmp.Dir();
  const config = {
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

  return (cb) => {
    gutil.log('Analyze your site’s web performance');
    gutil.log(options);

    Sitespeed.run(options, (err, data) => {
      if (err) {
        cb(new gutil.PluginError(PLUGIN_NAME, err + '\n\n'));
      } else if (data && data.budget) {
        const isFailing = budget.checkBudget(data, gutil, config);

        if (isFailing) {
          cb(new gutil.PluginError(PLUGIN_NAME, 'FAILED BUDGETS'));
        } else {
          cb();
        }
      } else {
        cb();
      }
    });
  };
};

module.exports = gulpSitespeedio;
