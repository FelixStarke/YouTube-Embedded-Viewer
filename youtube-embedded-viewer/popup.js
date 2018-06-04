const goButton = document.getElementById('goEmbedded');
const openInSelect = document.getElementById('openingMethod');

openInSelect.onchange = function(element) {
    chrome.storage.sync.set({openIn: element.target.selectedIndex}, null);
};

window.onload = function() {
    chrome.storage.sync.get('openIn', function(data) {
	openInSelect.selectedIndex = data.openIn;
    });
};

goButton.onclick = function(element) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	if (!tabs) return;
	
	const activeTab = tabs[0];
	const url = activeTab.url;
	
	const splits = url.split('?');
	if (splits.length != 2) return;
	
	const params = splits[1].split('&');
	if (params.length < 1) return;

	let videoId = '';
	for (let i = 0; i < params.length; i++) {
	    let param = params[i].split('=');
	    if (param.length != 2) continue;
	    
	    if (param[0] === 'v') {
		videoId = param[1];
		break;
	    }
	}

	if (!videoId.length) return;

	chrome.storage.sync.get('openIn', function(data) {
	    const url = 'https://www.youtube.com/embed/' + videoId;
	    
	    const openIn = data.openIn;
	    if (openIn === 0) {        // Open in current tab.
		chrome.tabs.update({url: url}, null);
	    } else if (openIn === 1) { // Open in new tab.
		chrome.tabs.create({url: url}, null);
	    } else if (openIn === 2) { // Open in new window.
		chrome.windows.create({url: url, type: 'normal', width: 1280, height: 720}, null);
	    } else if (openIn === 3) { // Open in popup window.
		chrome.windows.create({url: url, type: 'popup', width: 1280, height: 720}, null);
	    }
	});
    });
};
