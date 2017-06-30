var fs = require('fs'),
    argv = require('yargs').argv,
    through = require('through2'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError,
    path = require('path');

module.exports = function() {
  function readLines(file, encoding, callback) {
    var remaining = '',
    array = [];

    if (file.isNull()) {
      this.push(file);
      return callback();
    }

    var urlFile = file.path;

    var input = fs.createReadStream(urlFile);

    function func(data) {
      return array.push(data);
    }

    input.on('data', function(data) {
      remaining += data;
      var index = remaining.indexOf('\n');
      var last  = 0;
      while (index > -1) {
        var line = remaining.substring(last, index);
        last = index + 1;
        func(line);
        index = remaining.indexOf('\n', last);
      }

      remaining = remaining.substring(last);
    });

    input.on('end', function() {
      if (remaining.length > 0) {
        func(remaining);
      } else {
        return callback(null, array);
      }
    });
  }

  return through.obj(readLines);
};
