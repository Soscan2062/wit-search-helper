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
//NON WORKING FUNCTION, COMMENTED OUT
//FOR POSSIBLE FUTURE USES
// function AddDistance() {
	// var plus = document.getElementById('zip_plus');
	// if(plus == 'undefined' || plus == null) {
		// window.console.log('No Dist Plus element found');
		// return;
	// }
	// element found, add distances
	// strAdd = "<option value='15'>15 miles</option><option value='50'>50 miles</option></select>"
	// plus.innerHTML = plus.innerHTML + strAdd;
	// window.console.log('success');
// }
// window.addEventListener('load',AddDistance);

function FilterLocations() {
	//test variable for time
	myT = [1,performance.now()]; //first is event number for tracking, second is last call of Date()
	
	var table = document.getElementById('id_search_results');
	if(table == 'undefined' || table == null) {
		// window.console.log('No table found');
		return;
	}
	//***************************************
	//TIMING FUNCTION - REMOVE WHEN NOT IN USE
	myT = myTime(myT);
	
	//for fixing styling
	oddRow = true; 
	chrome.runtime.sendMessage({method: "getLocalStorage", key: "myDistances"}, function(response) {
		//window.console.log(response.data);
		var myDist = JSON.parse(response.data);
		//***************************************
		//TIMING FUNCTION - REMOVE WHEN NOT IN USE
		myT = myTime(myT);
		//window.console.log('Distances retrieved, total: ' + myDist.length);
		chrome.runtime.sendMessage({method: "getLocalStorage", key: "maxDist"}, function(response) {
			var myMax = response.data;
			//***************************************
			//TIMING FUNCTION - REMOVE WHEN NOT IN USE
			myT = myTime(myT);
			
			//find column of Location
			//Column count differs between logged in and out
			for (var i = 0, tHead = table.rows[0].childNodes; i < 6; i++) {			
				if (tHead[i*2+1].innerHTML.indexOf('Location') > -1) {
					var cLoc = i;
					break;
				}
			}

			//***************************************
			//TIMING FUNCTION - REMOVE WHEN NOT IN USE
			myT = myTime(myT);
			//var table = document.getElementById('id_search_results');
			for (var i = 1, row; row = table.rows[i]; i++) {
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
					//COMMENTED OUT FOR SCRIPT RUNTIME IMPROVEMENT
					// window.console.log(rCity + ' was not found.');
					// row.cells[cLoc].innerHTML = row.cells[cLoc].innerHTML + '<br/>CITY NOT FOUND';
				} else {
					//city found, compare and handle appropriately
					if(rowDist > myMax){ ////////////////////ADD DIFFERENT SETTING FROM OPTIONS
						//distance to city exceeds my Max, remove row
						//window.console.log(rCity + ' removed, dist was ' + rowDist + ', max is ' + myMax);
						deleteRow(table.rows[i]);
						i--; 
						// oddRow ^= true; //since row deleted, no change necessary, will flip on next iteration
					} else {
						//skip row, fix styling
						if(oddRow)
							table.rows[i].className = "oddRow";
						else
							table.rows[i].className = "";
						oddRow ^= true;
					}
				}
			}
			//***************************************
			//TIMING FUNCTION - REMOVE WHEN NOT IN USE
			myT = myTime(myT);
		});
	});
}
// function handleRow() {
	
// }

function deleteRow(btn) {
  var row = btn;
  row.parentNode.removeChild(row);
}

window.addEventListener('load',FilterLocations);

