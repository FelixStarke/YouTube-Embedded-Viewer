const openInSelect = document.getElementById('openingMethod');
const closeTabToggle = document.getElementById('closeTab');
const goButton = document.getElementById('goEmbedded');

let localCloseTab = false;

window.onload = function() {
    chrome.storage.sync.get('openIn', function(data) {
	if (data.openIn === undefined) return;
	openInSelect.selectedIndex = data.openIn;
	updateCloseTabUIVisibility(openInSelect.selectedIndex);
    });
    chrome.storage.sync.get('closeTab', function(data) {
	if (data.closeTab === undefined) return;
	localCloseTab = data.closeTab;
	updateCloseTabUI();
    });
};

openInSelect.onchange = function(element) {
    const index = element.target.selectedIndex;
    chrome.storage.sync.set({openIn: index}, null);
    updateCloseTabUIVisibility(index);
};

closeTabToggle.onclick = function(element) {
    localCloseTab = !localCloseTab;
    updateCloseTabUI();
    chrome.storage.sync.set({closeTab: localCloseTab}, null);
};

function updateCloseTabUI() {
    if (localCloseTab) {
	closeTabToggle.classList.remove('closeTab-inactive');
	closeTabToggle.classList.add('closeTab-active');
    } else {
	closeTabToggle.classList.remove('closeTab-active');
	closeTabToggle.classList.add('closeTab-inactive');
    }
}

function updateCloseTabUIVisibility(index) {
    if (index === 0) {
	closeTabToggle.style.display = 'none';
    } else {
	closeTabToggle.style.display = 'initial';
    }
}

goButton.onclick = function(element) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	if (!tabs) return;
	
	const activeTab = tabs[0]; // TODO: Really?
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
		if (localCloseTab) chrome.tabs.remove(activeTab.id, null);
		chrome.tabs.create({url: url}, null);
	    } else if (openIn === 2) { // Open in new window.
		if (localCloseTab) chrome.tabs.remove(activeTab.id, null);
		chrome.windows.create({url: url, type: 'normal', width: 1280, height: 720}, null);
	    } else if (openIn === 3) { // Open in popup window.
		if (localCloseTab) chrome.tabs.remove(activeTab.id, null);
		chrome.windows.create({url: url, type: 'popup', width: 1280, height: 720}, null);
	    }
	});
    });
};
