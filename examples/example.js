module.exports = function (unitTest) {
	
	unitTest.AddTest ('AdditionTest', function (test) {
		test.Assert (2 + 3 == 5);
	});

	unitTest.AddTest ('SubtractionTest', function (test) {
		test.Assert (2 - 3 == -1);
	});

	var opTestSuite = unitTest.AddTestSuite ('OperationsTest');
	opTestSuite.AddTest ('AdditionTest', function (test) {
		test.Assert (2 + 3 == 5);
	});

	opTestSuite.AddTest ('SubtractionTest', function (test) {
		test.Assert (2 - 3 == -1);
	});

	unitTest.AddSourceFile ('./examplemodule.js');
	
	var opTestSuiteLib = unitTest.AddTestSuite ('OperationsTestFromLib');
	opTestSuiteLib.AddTest ('AdditionTest', function (test) {
		test.Assert (Addition (2, 3) == 5);
	});

	opTestSuiteLib.AddTest ('SubtractionTest', function (test) {
		test.Assert (Subtraction (2, 3) == -1);
	});	
	
	var assertTestSuite = unitTest.AddTestSuite ('AssertTypesTest');
	assertTestSuite.AddTest ('AssertTest', function (test) {
		test.Assert (2 + 3 == 5);
		test.AssertEqual (2 + 3, 5);
		test.AssertEqualNum (2 + 3, 5, 0.1);
		test.AssertEqualNum (2 + 3, 4, 1.1);
		test.AssertEqualNum (2 + 3, 6, 1.1);
	});	
};
