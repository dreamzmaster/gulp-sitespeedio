'use strict';

exports.checkBudget = (data, gutil, config) => {
  // lets get the budget!
  gutil.log(gutil.colors.blue('------------------------------------------------- Check budget'));

  let failing = false;
  const showFailedOnly = config.showFailedOnly;

  const noPassedTests = 0;
  const noFailingTests = 0;
  let noSkippedTests = 0;

  gutil.log(gutil.colors.green((showFailedOnly ? 'Will show only failing test.' : 'Show both failing and passing tests.') +
    ' Change this by set gulp config showFailedOnly to true'));

  gutil.log(gutil.colors.cyan('the showFailedOnly is:' + showFailedOnly));

  data.budget.forEach((result) => {
    if (result.skipped) {
      noSkippedTests += noSkippedTests;
      if (!showFailedOnly) {
        gutil.log(gutil.colors.cyan('[SKIPPING]') + result.title + ' ' + result.url + ' value [' + result.value + ']');
      }
    } else if (result.isOk) {
      noSkippedTests += noSkippedTests;
      if (!showFailedOnly) {
        gutil.log(gutil.colors.green('[PASSED]') + ' The budget for ' + result.title + ' ' + result.url + '[' + result.value + ']');
      }
    } else {
      noSkippedTests += noSkippedTests;
      failing = true;
      gutil.log(gutil.colors.red('[FAILED]') + ' The budget for ' + result.title + ' ' + result.url + ' failed. ' + result.description);
    }
  });

  gutil.log('We got ' + noPassedTests + ' passing tests, ' + gutil.colors.red(noFailingTests + ' failing') + ((
    noSkippedTests > 0) ? ' ' + noSkippedTests + ' skipped tests' : '.'));

  gutil.log(gutil.colors.blue('------------------------------------------------- Finished checking budget'));

  return failing;
};
