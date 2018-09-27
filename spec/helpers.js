/* jQuery required for tests, which requires a full DOM */
var jquery = require('jquery');
/* XHTML/1.1-compatible, minimal, HTML document */
var minHTML = '<html><head><title>testsuite</title></head><body><p>Hello, World!</p></body></html>';

/* inject parse5 into the global Node.JS module loader */
var Module = require('module').Module;
var oldResolveFilename = Module._resolveFilename;
var cwd = process.cwd();
Module._resolveFilename = function _resolveFilename_patched(request, parent, isMain) {
	if (request == 'parse5')
		request = cwd + '/external/parse5/index.js';
	return (oldResolveFilename(request, parent, isMain));
};

/* load jsdom and instantiate a DOM */
var jsdom = require('../external/jsdom-no-contextify/lib/jsdom.js');
var doc = jsdom.jsdom(minHTML);

/* instantiate jQuery with the (virtual) DOM */
global.$ = jquery(doc.parentWindow);

/* load test suite stuff */
global.expect = require("chai").expect
