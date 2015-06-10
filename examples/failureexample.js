module.exports = function (unitTest) {
	
	unitTest.AddTest ('FailTest', function (test) {
		test.Assert (2 + 3 == 6);
		test.AssertEqual (2 + 3, 6);
		test.AssertEqualNum (2 + 3, 6, 0.1);
	});
};
