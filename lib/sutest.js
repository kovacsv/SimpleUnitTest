Logger = function (silent)
{
	this.silent = silent;
};

Logger.prototype.WriteTestSuiteStart = function (suite)
{
	this.WriteNewLine ();
	this.WriteText (this.GetColoredText ('green', '[ ------ ]') + ' ' + suite.GetName ());
};

Logger.prototype.WriteTestSuiteEnd = function (suite, allSucceeded)
{
	var text = ' ' + suite.GetName () + ' (' + suite.GetDuration () + ' ms)';
	if (allSucceeded) {
		this.WriteText (this.GetColoredText ('green', '[ ------ ]') + text);
	} else {
		this.WriteText (this.GetColoredText ('red', '[ ------ ]') + text);
	}
};

Logger.prototype.WriteTestResult = function (test, suite, errorLines)
{
	var text = ' ' + suite.GetName () + '.' + test.GetName () + ' (' + test.GetDuration () + ' ms)';
	if (errorLines.length === 0) {
		this.WriteText (this.GetColoredText ('green', '[ PASSED ]') + text);
	} else {
		this.WriteText (this.GetColoredText ('red', '[ FAILED ]') + text);
		var i, stackLine;
		for (i = 0; i < errorLines.length; i++) {
			stackLine = errorLines[i];
			this.WriteText ('  ' + stackLine);
		}
	}
};

Logger.prototype.WriteOverallResult = function (unitTest, succeeded)
{
	var resultString = 'PASSED';
	var color = 'green';
	if (!succeeded) {
		resultString = 'FAILED';
		color = 'red';
	}
	var text = ' (' + unitTest.GetDuration () + ' ms)';
	this.WriteNewLine ();
	this.WriteText (this.GetColoredText (color, '[ ' + resultString + ' ]') + text);
};

Logger.prototype.GetColoredText = function (color, text)
{
	if (color == 'green') {
		return '\x1b[1m\x1b[32m' + text + '\x1b[0m';
	} else if (color == 'red') {
		return '\x1b[1m\x1b[31m' + text + '\x1b[0m';
	} else if (color == 'default') {
		return text;
	}
	return text;
};

Logger.prototype.WriteNewLine = function ()
{
	this.WriteText ('');
};

Logger.prototype.WriteText = function (text)
{
	if (!this.silent) {
		console.log (text);
	}
};

TestHandler = function ()
{
	this.errorLines = [];
};

TestHandler.prototype.AssertInternal = function (condition)
{
	function GetStackLine ()
	{
		var error = new Error ();
		var stack = error.stack;
		var splitted = stack.split ('\n');
		if (splitted.length < 5) {
			return 'Invalid stack.';
		}
		
		var stackLine = splitted[4];
		var match = stackLine.match (/\((.*)\)/);
		if (match.length != 2) {
			return 'Invalid stack line.';
		}
		
		return ' -> ' + match[1];
	}

	if (!condition) {
		this.errorLines.push (GetStackLine ());
	}
};

TestHandler.prototype.Assert = function (condition)
{
	if (!condition) {
		this.errorLines.push ('Assert failed');
	}
	this.AssertInternal (condition);
};

TestHandler.prototype.AssertEqual = function (a, b)
{
	condition = (a == b);
	if (!condition) {
		this.errorLines.push ('AssertEqual failed (' + a + ', ' + b + ')');
	}
	this.AssertInternal (condition);
};

TestHandler.prototype.AssertEqualNum = function (a, b, eps)
{
	condition = (Math.abs (a - b) < eps);
	if (!condition) {
		this.errorLines.push ('AssertEqualNum failed (' + a + ', ' + b + ', ' +  eps + ')');
	}
	this.AssertInternal (condition);
};

TestHandler.prototype.GetErrorLines = function ()
{
	return this.errorLines;
};

TestHandler.prototype.IsSucceeded = function ()
{
	return this.errorLines.length === 0;
};

Test = function (name, testFunction)
{
	this.name = name;
	this.testFunction = testFunction;
	this.duration = 0;
};

Test.prototype.Run = function (logger, suite)
{
	var handler = new TestHandler ();
	
	var startTime = new Date ().getTime ();
	this.testFunction (handler);
	var endTime = new Date ().getTime ();
	this.duration = endTime - startTime;
	
	logger.WriteTestResult (this, suite, handler.GetErrorLines ());
	return handler.IsSucceeded ();
};

Test.prototype.GetName = function ()
{
	return this.name;
};

Test.prototype.GetDuration = function ()
{
	return this.duration;
};

TestSuite = function (name, filter)
{
	this.name = name;
	this.tests = [];
	this.filter = filter;
	this.duration = 0;
};

TestSuite.prototype.AddTest = function (testName, testFunction)
{
	if (this.filter.runOnlySuite !== null && this.filter.runOnlySuite !== this.name) {
		return;
	}

	if (this.filter.runOnlyTest !== null && this.filter.runOnlyTest !== testName) {
		return;
	}

	var test = new Test (testName, testFunction);
	this.tests.push (test);
};

TestSuite.prototype.GetName = function ()
{
	return this.name;
};

TestSuite.prototype.GetDuration = function ()
{
	return this.duration;
};

TestSuite.prototype.IsEmpty = function ()
{
	return this.tests.length === 0;
};

TestSuite.prototype.Run = function (logger)
{
	logger.WriteTestSuiteStart (this);
	var allSucceeded = true;
	var i, test, succeeded;
	for (i = 0; i < this.tests.length; i++) {
		test = this.tests[i];
		succeeded = test.Run (logger, this);
		this.duration += test.GetDuration ();
		if (!succeeded) {
			allSucceeded = false;
		}
	}
	logger.WriteTestSuiteEnd (this, allSucceeded);
	return allSucceeded;
};

UnitTest = function (rootDir, argv)
{
	this.suites = [];
	this.defaultSuite = null;
	this.rootDir = rootDir;
	
	this.filter = {
		runOnlySuite : null,
		runOnlyTest : null
	};
	this.duration = 0;
	this.silent = false;
	
	if (argv !== undefined && argv !== null) {
		var i, arg;
		for (i = 0; i < argv.length; i++) {
			arg = argv[i];
			if (arg == '-silent') {
				this.silent = true;
			} else if (arg == '-suite' && i < argv.length - 1) {
				this.filter.runOnlySuite = argv[i + 1];
			} else if (arg == '-test' && i < argv.length - 1) {
				this.filter.runOnlyTest = argv[i + 1];
			}
		}
	}
	
	this.logger = new Logger (this.silent);
};

UnitTest.prototype.AddSourceFile = function (fileName)
{
	var path = require ('path');
	var fullPath = path.resolve (this.rootDir, fileName);

	var fs = require ('fs');
	var content = fs.readFileSync (fullPath).toString ();

	eval.apply (global, [content]);
};

UnitTest.prototype.AddTestFile = function (fileName)
{
	var path = require ('path');
	var fullPath = path.resolve (this.rootDir, fileName);
	require (fullPath) (this);
};

UnitTest.prototype.AddTestSuite = function (suiteName)
{
	var suite = new TestSuite (suiteName, this.filter);
	this.suites.push (suite);
	return suite;
};

UnitTest.prototype.AddTest = function (testName, testFunction)
{
	if (this.defaultSuite === null) {
		this.defaultSuite = this.AddTestSuite ('Default');
	}
	this.defaultSuite.AddTest (testName, testFunction);
};

UnitTest.prototype.GetDuration = function ()
{
	return this.duration;
};

UnitTest.prototype.Run = function ()
{
	var allSucceeded = true;
	var i, suite, succeeded;
	for (i = 0; i < this.suites.length; i++) {
		suite = this.suites[i];
		if (suite.IsEmpty ()) {
			continue;
		}
		succeeded = suite.Run (this.logger);
		this.duration += suite.GetDuration ();
		if (!succeeded) {
			allSucceeded = false;
		}
	}
	
	this.logger.WriteOverallResult (this, allSucceeded);
	return allSucceeded;
};

module.exports = {
	UnitTest : UnitTest,
	Emulators : {
		DataView : require ('./emulators/dataview.js')
	}
};
