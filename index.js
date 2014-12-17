#!/usr/bin/env node

if (process.argv.length < 3) {
	console.log ('\nUsage:');
	console.log ('\tsutest testfile [options]');
	console.log ('\nOptions:');
	console.log ('\t-suite suitename: Run only the given suite.');
	console.log ('\t-test testname: Run only the given test.');
	console.log ('\t-silent: Silent mode.');
	process.exit (1);
}

var path = require ('path');

var fullPath = path.resolve (process.argv[2]);
var dirName = path.dirname (fullPath);

var sutest = require ('./lib/sutest.js');
var unitTest = new sutest.UnitTest (dirName, process.argv);

global.DataView = sutest.Emulators.DataView;
require (fullPath) (unitTest);

var resultNum = 0;
if (!unitTest.Run ()) {
	resultNum = 1;
}

process.exit (resultNum);
