/*
This file is part of Work in Texas (WIT) Search Helper.

    WIT Search Helper is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    WIT Search Helper is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with WIT Search Helper.  If not, see <http://www.gnu.org/licenses/>.
*/

/*
functions for getting and setting correct value from local storage
local storage key: WITStorage
array structure: see function getNewLocStorArray below
*/
function getLocalStorage(loc) {
	arr = testLocalStorageIntegrity();
	if(loc == 'maxDist')
		return arr[0].maxDist;
	else if(loc == 'myZip')
		return arr[0].myZip;
	else if(loc == 'resultHandling') 
		return arr[0].resultHandling;
	else if(loc == 'myDistances') 
		return arr[0].myDistances;
	else
		window.console.log('Nothing returned for ' + loc); 
}
//arrAdd array structure: [value to add, key to add to]
function setLocalStorage(arrAdd) { 
	arr = testLocalStorageIntegrity();
	for (i = 0; i < arrAdd.length; i++) {
		var val = arrAdd[i][0];
		var loc = arrAdd[i][1];
		if(loc == 'maxDist')
			arr[0].maxDist = val;
		else if(loc == 'myZip')
			arr[0].myZip = val;
		else if(loc == 'resultHandling')
			arr[0].resultHandling = val;
		else if(loc == 'myDistances')
			arr[0].myDistances = val;
	}
	localStorage['WITStorage'] = JSON.stringify(arr);
	return;	
}

function testLocalStorageIntegrity() {
	var arr = localStorage['WITStorage'];
	if(arr == 'undefined' || arr == null) {
		//empty or error, redo storage
		// lOut('Redoing Array');
		return getNewLocStorArray();
	}
	arr = JSON.parse(arr);
	if(arr.length != 4) {
		//empty or error, redo storage
		// lOut('Redoing Array');
		return getNewLocStorArray();
	}
	//no problems, return good local storage values
	return arr;
}

//SET DEFAULT VALUES HERE, ALL VALUES ARE PRELOADED FROM THIS ARRAY
function getNewLocStorArray() {
	var myArray = [
		{"maxDist":"20"},
		{"myZip":"76010"},
		{"resultHandling":""},
		{"myDistances":""}
	]
return myArray;
}

//shortened script for printing to console log
function lOut(str) {
	window.console.log(str);
}

//functions for testing time to execute scripts
function myTime(a) {
	i = performance.now();
	lOut(a[0] + ". " + (i-a[1]));
	a[0]++;
	a[1] = i;
	return a;
}