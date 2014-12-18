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
