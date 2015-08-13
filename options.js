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

function displayStatusMesage(curStatusMessage)
{
	document.getElementById("statusMess").innerHTML = curStatusMessage;
	setTimeout(function() {
		document.getElementById("statusMess").innerHTML = "";
	}, 3000);
}
function displayCalcStatus(curStatusMessage)
{
	document.getElementById("statusMessCacl").innerHTML = curStatusMessage;
	// change from timer to seeing if calculation is complete, handle error
	setTimeout(function() {
		document.getElementById("statusMessCacl").innerHTML = "";
	}, 3000);
}

function calculateDistance() {
	var curStatusMessage = " Calculating";
	var output = "<table><tr><td><b>City</b></td><td><b>Distance</b></td></tr>\n"; //placeholder for text output
	var i;
	var myLat = ""; //gps coord of my current zip
	var myLng = ""; //gps coord of my current zip
	var R = 3958.756; // miles 6371; // km 
	var strMyZip = document.getElementById('thiszip').value;
	var txCities = getCities();
	var storeDistances = "";
	localStorage['myZip'] = strMyZip;
	displayCalcStatus(curStatusMessage);
	
	//search for zip codes gps coordinates
	//verify zip code is valid
	if(!$.isNumeric(strMyZip) || strMyZip.length>5)
	{
		curStatusMessage = "There was an error with the zip code.";
		displayCalcStatus(curStatusMessage);
		return;
	}
	//find my lat and lng
	var i = txCities.map(function(e) { return e.zip; }).indexOf(strMyZip);
	myLat = txCities[i].lat;
	myLng = txCities[i].lng;
	
	//make sure lat and lng were returned
	if(!$.isNumeric(myLat) || !$.isNumeric(myLng))
	{
		curStatusMessage = "There was an error retrieving your zip code.";
		displayCalcStatus(curStatusMessage);
		return;
	}
	//create a new object with calculated distance
	for(i = 0; i<txCities.length; i++){
		//using haversine equation
		//has a problem with the .toRad() method below.
		var lat2 = txCities[i].lat; 
		var lon2 = txCities[i].lng; 
		var dLat = (lat2 - myLat) * Math.PI / 180; 
		var dLon = (lon2 - myLng) * Math.PI / 180; 
		var a = 0.5 - Math.cos(dLat)/2 + Math.cos(myLat * Math.PI / 180) * 
			Math.cos(lat2 * Math.PI / 180) * (1 - Math.cos(dLon))/2;  
		var dist = R * 2 * Math.asin(Math.sqrt(a)); 

		output = output + "<tr><td>" + txCities[i].city + "</td><td class='alnright'>" + dist.toFixed(2) + "</td></tr>" + "\n";
		storeDistances = pushArray(storeDistances,[{"city":txCities[i].city,"dist":dist.toFixed(2)}]);
	}
	
	//update options page
	document.getElementById('distPrev').innerHTML = output;
	
	//store object
	localStorage['myDistances'] = JSON.stringify(storeDistances);
	//var x = JSON.parse(localStorage['myDistances']);
}

function save_options() {
	var curStatusMessage = "";
	var resHanSel = document.getElementsByName("resultHandling");
	var selResHan = 0;
	if(resHanSel)
	{
		for (x=0; x < resHanSel.length; x++) 
		{
			if ( resHanSel[x].checked )
				selResHan = resHanSel[x].value;
		}
	}
	
	if (selResHan != 0)
	{
		// Result handling chosen, save value
		localStorage["result_handling"] = selResHan;
		curStatusMessage = "Options Saved.";			
	}
	else	
		curStatusMessage = "Please select a Result Handling option.";

	calculateDistance();
		
	displayStatusMesage(curStatusMessage);
}

// Restores select box state to saved value from localStorage.
function restore_options() 
{
	//add necessary event listeners
	document.getElementById('saveOptions').addEventListener('click', save_options);
	document.getElementById('calcDist').addEventListener('click', calculateDistance);
	//document.getElementById('distCalcF').addEventListener('submit', calculateDistance);
	
	document.getElementById("statusMess").innerHTML = "";	
		
	var preferredResHan = localStorage["result_handling"];
	if (!preferredResHan)
		return;

	var resHanSel = document.getElementsByName("resultHandling");
	var curSelVal = 0;
	if (resHanSel)
	{
		for (x=0; x < resHanSel.length; x++) 
		{
			curSelVal = resHanSel[x].value
			if (resHanSel[x].value == preferredResHan) 
			{
				resHanSel[x].checked = "true";
				break;
			}
		}
	}
	
	curStatusMessage = "Options restored.";
	displayStatusMesage(curStatusMessage);
}
function pushArray(arr, newArr) {
	if(typeof(arr[0]) !== 'undefined' && arr instanceof Array) { 
		arr = arr.concat(newArr);
	} else {
		arr = newArr;
	}
	return arr;
}

document.addEventListener('DOMContentLoaded', restore_options);
