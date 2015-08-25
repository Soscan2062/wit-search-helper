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

//REQUIRED for passing localstorage variables from extension to content scripts (webpages) for use
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == 'getLocalStorage')
      sendResponse({data: localStorage[request.key]});
    else 
      sendResponse({}); // snub them.
});

/*
For opening options on first install
using a system for making changes after updates later
blank/0 - no install, load options to set defaults
1.3 - current version
*/
function install_notice() {
	var vers = chrome.runtime.getManifest().version;
    if (localStorage.getItem('changes_check') == vers)
        return;

	//additional version prompt changes go here
	
    //set vers, open options for first install
    localStorage.setItem('changes_check', vers);
    chrome.tabs.create({url: "options.html"});
}
install_notice();

