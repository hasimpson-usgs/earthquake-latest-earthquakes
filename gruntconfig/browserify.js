'use strict';

var config = require('./config');


var ALL_CLASSES,
    CWD,
    JS,
    NODE_MODULES;

CWD = '.';
JS = CWD + '/' + config.src + '/htdocs/js';
NODE_MODULES = CWD + '/node_modules';


ALL_CLASSES = [
];


var browserify = {
  options: {
    browserifyOptions: {
      debug: true,
      paths: [
        JS,
        NODE_MODULES + '/hazdev-webutils/src'
      ]
    }
  },

  bundle: {
    src: [],
    dest: config.build + '/' + config.src + '/htdocs/js/bundle.js',
    options: {
      alias: ALL_CLASSES
    }
  },

  index: {
    src: [JS + '/index.js'],
    dest: config.build + '/' + JS + '/index.js',
    options: {
    }
  },

  test: {
    src: [config.test + '/test.js'],
    dest: config.build + '/' + config.test + '/test.js',
    options: {
      external: ALL_CLASSES
    }
  }
};


module.exports = browserify;