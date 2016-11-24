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
	url: 'http://localhost/',
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

    gulp.task('default', function (done) {
      sitespeedio({
        url: "http://localhost:3000/",
        depth: 2,
      })(done)
    });


With this in place, gulp-sitespeedio will now collect performance metrics for your site.

## The result files
The result files will automatically be stored in a temporary directory. If you want to change that, use 
the *resultBaseDir* property, like this:

```javascript

{
	url: 'http://www.sitespeed.io',
	deepth: 1,
	resultBaseDir: '/my/new/dir/'
}
```

## Use cases
Fetch timings, sending performance metrics to Graphite and performance budgets.

### Fetching timing metrics

You can choose to collect Navigation Timing and User Timing metrics using real browser. You can choose by using Firefox or Chrome. And you can configure the connection speed ([more info](http://www.sitespeed.io/documentation/#connectionspeed) by choosing between mobile3g, mobile3gfast, cable and native. And choose how many times you want to test each URL (default is 3).

You surely want to combine it with running [Xvfb](https://gist.github.com/nwinkler/f0928740e7ae0e7477dd) to avoid opening the browser. 

```javascript
{
	urls: ['http://www.sitespeed.io', 'http://www.sitespeed.io/faq/'],
	browser: 'chrome',
	connection: 'cable',
	no: 11
}
```

### Send the data to Graphite
You can choose to send you metrics to Grafana to make graphs of your performance metrics (prefarable using [Grafana](http://grafana.org/)). Read more about sitespeed and Grahite [here](http://www.sitespeed.io/documentation/#graphite-full).

```javascript
{
	urls: ['http://www.sitespeed.io', 'http://www.sitespeed.io/faq/'],
	browser: 'chrome',
	connection: 'cable',
	graphiteHost: 'localhost',
	graphitePort: 2003,
	graphiteNamespace: 'sitespeed'
}
```

### Performance Budget
Test your site against a [performance budget](http://timkadlec.com/2013/01/setting-a-performance-budget/). You can test your site against the following:
* Sitespeed.io web performance best practices score [rules]
* Page metrics: Number of requests per page, page weight, number of requests per typ and weight per type [page]
* Navigation Timings and User Timings using Chrome/Firefox [timings]
* WebPageTest [wpt]
* Google Page Speed insights score [gpsi]

And you can and should of course combine them.

If you want to include/exclude tests in the output, you can switch that by a gulp config like:

```
{
	urls: ['http://www.sitespeed.io', 'http://www.sitespeed.io/faq/'],
	showFailedOnly: true // or false
}
```

#### Performance Budget web performance best practice score
You can continously test your site against sitespeed.io web performance best practice rules. In this example all scores needs to be better than 90 (100 is the max score).

You can skip testing specfic rules with the **skipTest** configuration. In this example we skip the CDN rule and the textcontent rule ([here](http://www.sitespeed.io/rules/) is the rule list, you find the rule id inside the parentheses per rule.

```javascript
{
	urls: ["http://www.sitespeed.io", "http://www.sitespeed.io/faq/"],
	skipTest: "ycdn,textcontent",
	budget: {
		rules: {
			default: 90
		}
	}
}
```
#### Performance Budget page metrics
Keep track of the page metrics of your site like number of requests per page, page weight, number of requests per type and weight per type.

You can configure the following
* requests - number of requests
* pageWeight - the total page weight
* js and jsWeight
* css and cssWeight
* image and imageWeight
* cssimage and cssimageWeight
* font and fontWeight
* flash and flashWeight
* iframe
* doc and docWeight

```javascript
{
	urls: ["http://www.sitespeed.io", "http://www.sitespeed.io/faq/"],
	headless: 'slimerjs',
	budget: {
		page: {
			image: 10,
			css: 1,
			requests: 7,
			pageWeight:300000,
			jsWeight: 0
		}
	}
}
```


#### Performance Budget timings
You can test your sites browser timings fetched using the Navigation Timing API and the User Timing API. You can test the following [metrics](http://www.sitespeed.io/documentation/#timingMetrics). 

In the follwing example we test the RUM speed index score, headerTime and logoTime (specific user timings implemented on this site) and the domContentLoadedTime. If any timings are bigger than configured, it will fail.


```javascript
{
	urls: ["http://www.sitespeed.io", "http://www.sitespeed.io/faq/"],
	browser: "chrome",
	no: 17,
	budget: {
		timings: {
			speedIndex: 1000,
			headerTime: 800,
			logoTime: 500,
			domContentLoadedTime: 900
		}
	}
}
```

#### Performance Budget WebPageTest
You can setup your performance budget testing using WebPageTest. You a private instance or a [key](http://www.webpagetest.org/getkey.php) to the public version.

If you want to configure specific WebPageTest configuration, do that with the **wptConfig** parameter, it will pass all parameters on to the [runTest](https://github.com/marcelduran/webpagetest-api#user-content-test-works-for-test-command-only) method that is used in the backend.

In this example, we test two urls nine times, using 3G and Firefox. We will test the median run and make sure the page cannot have more than 60 requests, the total size is not bigger than 1 mb and that we get a speed index score less than 1000.

```javascript
{
	urls: ["http://www.sitespeed.io", "http://www.sitespeed.io/faq/"],
	noYslow: true,
	wptKey: "YOUR_SECRET_KEY",
	wptHost: "www.webpagetest.org",
	no: 9, 
	wptConfig: {
		location: "Dulles:Firefox",
		connectivity: "3G",
		timeout: 800
	},
	budget: {
		wpt: {
			requests: 60,
			bytesIn: 1000000,
			SpeedIndex: 1000
		}
	}
}
```

#### Performance Budget Google Page Speed Insights
You can match your [Google Page Speed Score](https://developers.google.com/speed/pagespeed/) if your site is accessibble from the internet.

In this example, we will crawl the start url for a deep of 2 and test every URL against the Google Page Speed Score for mobile and will fail if it is lower than 90.

```javascript
{
	url: "http://www.sitespeed.io",
	deepth: 2,
	noYslow: true,
	gpsiKey: 'YOUR_SECRET_GOOGLE_KEY',
	profile: 'mobile',
	budget: {
		gpsi: {
			score: 96
		}
	}
}
```

## Options
Here are the configuration options.

#### options.url

Type `String`
Default value: NONE 

The url you want test.

#### options.urls

Type `Array`
Default value: NONE 

An Array with URL:s that you want to test. If you supply an array the exact pages will be tested.

#### options.deepth

Type `Number`
Default value: 1 

How deep you want to crawl.

#### options.resultBaseDir

Type `String`
Default value: Temporary dir 

Where the result HTML files will be stored. By default they are stored in a temporary directory.

#### options.requestHeaders

Type `JSON`
Default value: NONE 

A JSON like `{"name":"value","name2":"value"}`.

### The browser

#### options.browser

Type `String`
Default value: NONE 

What browser to use when fetching timings. Choose between *chrome* or *firefox*.

#### options.no

Type `Number`
Default value: 3 

How many times each page should be tested when fetching timing.

#### options.connection

Type `String`
Default value: 'native'

The connection speed ([more info](http://www.sitespeed.io/documentation/#connectionspeed)). Choose between: *mobile3g*, *mobile3gfast*, *cable* or *native*

### Graphite

#### options.graphiteHost

Type `String`
Default value: NONE

The Graphite host.

#### options.graphitePort

Type `Number`
Default value: 2003

The Graphite port.

#### options.graphiteNamespace

Type `String`
Default value: sitespeed.io

The namespace of every key sent to Graphite.

### WebPageTest

#### options.wptHost

Type `String`
Default value: NONE

The host.

#### options.wptKey

Type `String`
Default value: NONE

The secret key if you use the public WPT instance.

#### options.wptConfig

Type `JSON`
Default value: Check below

Will be passed to [runTest](https://github.com/marcelduran/webpagetest-api#user-content-test-works-for-test-command-only) method on the NodeJS WebPageTest API. The default config looks like this:

```
{
pollResults: 10,
timeout: 600,
firstViewOnly: false,
runs: // the number of runs you configure by the n parameter, default 3
private: true,
aftRenderingTime: true,
location: 'Dulles:Chrome',
video: true
}
```

### Can't find the configuration

sitespeed.io is highly configurable. The gulp-sitespeedio plugin will pass every option to sitespeed, you can see each and every configuration [here](http://www.sitespeed.io/documentation/#theoptions). Each option needs to be called with full name (meaning the same as using **--** for the cli. Say for example that don't want to run the YSlow rules. Using the cli, you add the flag <code>--noYslow</code>

Doing the same with the gulp plugin:
```javascript
{
	url: 'http://www.sitespeed.io',
	deepth: 1,
	noYslow: true
}
```
