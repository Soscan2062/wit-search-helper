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

chrome.extension.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    message.innerText = request.source;
  }
});

// function testCode() {	

// }

function onWindowLoad() {
	// document.getElementById('testButton').addEventListener('click', testCode);

	var message = document.querySelector('#message');
	
	//load previous maxDistance if available
	var myMax = localStorage['maxDist'];
	if($.isNumeric(myMax))
		document.getElementById('maxDist').value = localStorage['maxDist'];
	else {
		document.getElementById('maxDist').value = 20;
		localStorage['maxDist'] = 20;
	}
		
	
	//add listener to save value when changed
	//and keep non numeric values out
	document.getElementById('maxDist').addEventListener('input',function(){
		var myMax = document.getElementById('maxDist').value;
		if($.isNumeric(myMax))
			localStorage['maxDist'] = myMax;
		else if(document.getElementById('maxDist').value != "")
			document.getElementById('maxDist').value = localStorage['maxDist'];
	});
}

window.onload = onWindowLoad;

