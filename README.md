SimpleUnitTest
==============

Simple unit test framework for not node based javascript modules.

Usage
-----

Install the package with npm:

```
npm install -g sutest
```

Write your test script file:

```js
module.exports = function (unitTest) {

	unitTest.AddTest ('AdditionTest', function (test) {
		test.Assert (2 + 3 == 5);
	});
	
};
```

Run the test from command line:

```
sutest mytestfile.js
```

Create suites
-------------

You can create test suites, and add tests to suites:

```js
module.exports = function (unitTest) {

	var opTestSuite = unitTest.AddTestSuite ('OperationsTest');
	
	opTestSuite.AddTest ('AdditionTest', function (test) {
		test.Assert (2 + 3 == 5);
	});
	
	opTestSuite.AddTest ('SubtractionTest', function (test) {
		test.Assert (2 - 3 == -1);
	});
	
};
```

Include modules
---------------

You can add not node based modules, and use them in your tests.

For example, create a module with this content:

```js
function Addition (a, b)
{
	return a + b;
}

function Subtraction (a, b)
{
	return a - b;
}
```

Now you can add this module to your test: 

```js
module.exports = function (unitTest) {

	unitTest.AddSourceFile ('./operationsmodule.js');
	
	var opTestSuiteLib = unitTest.AddTestSuite ('OperationsTestFromLib');
	
	opTestSuiteLib.AddTest ('AdditionTest', function (test) {
		test.Assert (Addition (2, 3) == 5);
	});
	
	opTestSuiteLib.AddTest ('SubtractionTest', function (test) {
		test.Assert (Subtraction (2, 3) == -1);
	});
	
};
```

Create multiple test files
--------------------------

You can create multiple test files, and call them from a main test file:

```js
module.exports = function (unitTest)
{

	unitTest.AddTestFile ('./additiontest.js');
	unitTest.AddTestFile ('./subtractiontest.js');

};
```

Usage as library
----------------

Install the package locally:

```
npm install sutest
```

Create your standalone test file:

```js
var path = require ('path');
var dirName = path.dirname (require.main.filename);

var sutest = require ('sutest');
var unitTest = new sutest.UnitTest (dirName, process.argv);

var opTestSuite = unitTest.AddTestSuite ('OperationsTest');
opTestSuite.AddTest ('AdditionTest', function (test) {
	test.Assert (2 + 3 == 5);
});

opTestSuite.AddTest ('SubtractionTest', function (test) {
	test.Assert (2 - 3 == -1);
});

unitTest.Run ();
```

Run the file:

```
node mytestfile.js
```
