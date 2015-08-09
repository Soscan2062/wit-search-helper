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

