import os
import sys
import re

currentPath = os.path.dirname (os.path.abspath (__file__))
os.chdir (currentPath)

def JSHint (path):
	result = os.system ('jshint --config jshintconfig.json' + ' ' + path)
	if result != 0:
		return False
	return True
	
def Main ():
	paths = [
		os.path.abspath ('../lib'),
		os.path.abspath ('../index.js')
	];
	
	for path in paths:
		print ('JSHint path <' + path + '>.')
		succeeded = JSHint (path)
		if not succeeded:
			print ('Found JSHint errors.');
			return 1

	return 0
		
sys.exit (Main ())
