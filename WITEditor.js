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

function FilterLocations() {
	//test variable for time
	// myT = [1,Date()]; //first is event number for tracking, second is last call of Date()
	
	var table = document.getElementById('id_search_results');
	if(table == 'undefined' || table == null) {
		window.console.log('No table found');
		return;
	}
	chrome.runtime.sendMessage({method: "getLocalStorage", key: "myDistances"}, function(response) {
		//window.console.log(response.data);
		var myDist = JSON.parse(response.data);
		//window.console.log('Distances retrieved, total: ' + myDist.length);
		chrome.runtime.sendMessage({method: "getLocalStorage", key: "maxDist"}, function(response) {
			var myMax = response.data;
			
			//find column of Location
			//Column count differs between logged in and out
			for (var i = 0, tHead = table.rows[0].childNodes; i < 6; i++) {			
				if (tHead[i*2+1].innerHTML.indexOf('Location') > -1) {
					var cLoc = i;
					break;
				}
			}

			//var table = document.getElementById('id_search_results');
			for (var i = 1, row; row = table.rows[i]; i++) {
				//THIS SHOULD BE UNNECESSARY
				//break if outside of table length
				// if(i > table.rows.length)
					// break;
				
				//iterate through rows and verify their distance is below Max
				var rCity = row.cells[cLoc].innerText;
				//find citys precalculated distance
				var j = myDist.map(function(e) { return e.city; }).indexOf(rCity);
				var rowDist = "NF"; //placeholder for if a city is not found
				if(Array.isArray(j)){
					//multiple cities returned, find smallest distance
					var jSmall = 1000000;
					for (var k = 0; k < j.length; k++) {
						if(j[k].dist < jSmall)
							jSmall = j[k].dist;
					}
					var rowDist = Number(jSmall);
				} else if(j != -1) {
					//one city location returned
					var rowDist = Number(myDist[j].dist);
				}
				if(rowDist == "NF") {
					//city not found
					window.console.log(rCity + ' was not found.');
					row.cells[cLoc].innerHTML = row.cells[cLoc].innerHTML + '<br/>CITY NOT FOUND';
				} else {
					//city found, compare and handle appropriately
					if(rowDist > myMax){ ////////////////////ADD DIFFERENT SETTING FROM OPTIONS
						//distance to city exceeds my Max, remove row
						//window.console.log(rCity + ' removed, dist was ' + rowDist + ', max is ' + myMax);
						deleteRow(table.rows[i]);
						i--;
					}
				}
			}
		});
	});
}
function deleteRow(btn) {
  var row = btn;
  row.parentNode.removeChild(row);
}

//START - for testing purposes
function lOut(str) {
	window.console.log(str);
}
function myTime(a) {
	lOut(a[0] + ". " + Date()-a[1]);
	a[0]++;
	a[1] = Date();
}
//END - for testing purposes

window.addEventListener('load',FilterLocations);
