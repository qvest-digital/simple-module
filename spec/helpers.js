var jquery = require('jquery');
var minHTML = '<html><head><title>testsuite</title></head><body><p>Hello, World!</p></body></html>';

var jsdom = require('../external/jsdom-no-contextify/lib/jsdom.js');
var doc = jsdom.jsdom(minHTML);

global.$ = jquery(doc.parentWindow);
global.expect = require("chai").expect
