SimpleUnitTest
==============

Simple unit test framework for not node specific javascript modules.

Usage
-----

Install the package with npm:

```
npm install sutest -g
```

Write your test script file:

```
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
