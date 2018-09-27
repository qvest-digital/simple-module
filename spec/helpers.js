var jsdom = require('jsdom');
var jquery = require('jquery');
var dom = new jsdom.JSDOM('<html><head><title>testsuite</title></head><body><p>Hello, World!</p></body></html>');
global.$ = jquery(dom.window);
global.expect = require("chai").expect
