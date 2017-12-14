'use strict';

let gulp = require('gulp'),
  sitespeedio = require('./tasks/sitespeed.js'),
  options = {
    urls: ['https://www.sitespeed.io', 'https://www.sitespeed.io/faq/'],
    browsertime: {
      connectivity: 'native',
      browser: 'chrome',
      iterations: 1,
    },
    budget: {
      config: {
        'browsertime.pageSummary': [{
          metric: 'statistics.timings.firstPaint.median',
          max: 1000
        }, {
          metric: 'statistics.visualMetrics.FirstVisualChange.median',
          max: 1000
        }],
        'coach.pageSummary': [{
          metric: 'advice.performance.score',
          min: 75
        }, {
          metric: 'advice.info.domElements',
          max: 200
        }, {
          metric: 'advice.info.domDepth.max',
          max: 10
        }, {
          metric: 'advice.info.iframes',
          max: 0
        }, {
          metric: 'advice.info.pageCookies.max',
          max: 5
        }],
        'pagexray.pageSummary': [{
          metric: 'transferSize',
          max: 100000
        }, {
          metric: 'requests',
          max: 20
        }, {
          metric: 'missingCompression',
          max: 0
        }, {
          metric: 'contentTypes.css.requests',
          max: 1
        }, {
          metric: 'contentTypes.image.transferSize',
          max: 100000
        }, {
          metric: 'documentRedirects',
          max: 0
        }]
      }
    }
  };

gulp.task('build', sitespeedio(options));
