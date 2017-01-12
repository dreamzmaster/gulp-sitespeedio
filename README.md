# gulp-sitespeedio

## Test your website using sitespeed.io

gulp-sitespeedio is a [gulp.js](https://github.com/gulpjs/gulp) task for testing your site against web performance best practice rules, fetch timings from a browser, test and enforce [performance budgets](#performance-budget), send performance metrics to [Graphite](http://graphite.wikidot.com/) using [sitespeed.io](http://www.sitespeed.io).

Check out the [documentation](http://www.sitespeed.io/documentation/) to get a full overview of what you can do and test using [sitespeed.io](http://www.sitespeed.io).

## Getting Started

If you haven't used [gulp](http://gulpjs.com/) before, be sure to check out the [Getting Started](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) guide, as it explains how to create a gulpfile.js as well as install and use gulp plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install gulp-sitespeedio --save-dev
```

Once the plugin has been installed, it may be enabled inside your gulpfile with this line of JavaScript:

```js
var sitespeedio = require('gulp-sitespeedio');
```

## The sitespeedio task

### Required configuration properties

To start testing pages, you must configure either a start URL for your crawl (yep sitespeed.io will crawl your site for a configurable depth) or an array of specific URL:s that you want to test.

Crawl the site with deepth 1.
```javascript
{
	urls: ['http://localhost/'],
	deepth: 1
}
```

### Testing specific URLs
```javascript
{
	urls: ['http://www.sitespeed.io', 'http://www.sitespeed.io/faq/']
}
```

With these configuration properties set, you can add `sitespeedio` to your default tasks list. That'll look something like this:

    gulp.task('default', ['jshint', 'sitespeedio']);

If you run it with custom options you need to run like this:

```javascript
gulp.task('default', function (done) {
  sitespeedio({
    urls: ["http://localhost:3000/"],
    depth: 2,
  })(done)
});
```

With this in place, gulp-sitespeedio will now collect performance metrics for your site.

## The result files
The result files will automatically be stored in a temporary directory. If you want to change that, use
the *resultBaseDir* property, like this:

```javascript

{
	url: 'http://www.sitespeed.io',
	outputFolder: '/my/new/dir/'
}
```

## Use cases
Fetch timings, sending performance metrics to Graphite and performance budgets.

### Fetching timing metrics

You can choose to collect Navigation Timing and User Timing metrics using real browser. You can choose by using Firefox or Chrome. And you can configure the connection speed ([more info](http://www.sitespeed.io/documentation/#connectionspeed) by choosing between mobile3g, mobile3gfast, cable and native. And choose how many times you want to test each URL (default is 3).

You surely want to combine it with running [Xvfb](https://gist.github.com/nwinkler/f0928740e7ae0e7477dd) to avoid opening the browser.

```javascript
{
	urls: ['https://www.sitespeed.io', 'https://www.sitespeed.io/faq/'],
  browsertime: {
    browser: 'firefox'
   	connectivity: 'cable',
  	iterations: 5,
  }
}
```

### Performance Budget
Test your site against a [performance budget](http://timkadlec.com/2013/01/setting-a-performance-budget/). You can test your site against almost all data collected by sitespeed.io.

Checkout the [example Gruntfile]() and budget looks something like this:

```
budget: {
  "browsertime.pageSummary": [{
    "metric": "statistics.timings.firstPaint.median",
    "max": 1000
  }, {
    "metric": "statistics.visualMetrics.FirstVisualChange.median",
    "max": 1000
  }],
  "coach.pageSummary": [{
    "metric": "advice.performance.score",
    "min": 75
  }, {
    "metric": "advice.info.domElements",
    "max": 200
  }, {
    "metric": "advice.info.domDepth.max",
    "max": 10
  }, {
    "metric": "advice.info.iframes",
    "max": 0
  }, {
    "metric": "advice.info.pageCookies.max",
    "max": 5
  }],
  "pagexray.pageSummary": [{
    "metric": "transferSize",
    "max": 100000
  }, {
    "metric": "requests",
    "max": 20
  }, {
    "metric": "missingCompression",
    "max": 0
  }, {
    "metric": "contentTypes.css.requests",
    "max": 1
  }, {
    "metric": "contentTypes.image.transferSize",
    "max": 100000
  }, {
    "metric": "documentRedirects",
    "max": 0
  }]
}
```

If you want to include/exclude tests in the output, you can switch that by a gulp config like:

```

{
  urls: ['http://www.sitespeed.io', 'http://www.sitespeed.io/faq/'],
  showFailedOnly: true // or false
}
```


### Can't find the configuration

ssitespeed.io is highly configurable. The gulp-sitespeedio plugin will pass every option to sitespeed, you can see each and every configuration [here](). Each option needs to be called with full name (meaning the same as using **--** for the cli. Say for example that don't need the screenshot for each. Using the cli, you add the flag <code>--browsertime.screenshot false</code>

Doing the same with the gulp plugin:
```javascript
{
	url: 'http://www.sitespeed.io',
	browsertime: {
        screenshot: false
    }
}
```

### CLI options

You can use `--txtPath` to pass the txt filename and pass the urls instead adding in the gulp process. By default the file it's inside tasks/data/urls.txt but you can as many txts file you want.
