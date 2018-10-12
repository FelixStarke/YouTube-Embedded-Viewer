let localCloseTab = false;

window.onload = function () {
	// Initialize UI Elements
	const openInSelect = new Dropdown('open-in', ['Current Tab', 'New Tab', 'New Window', 'Popup Window']);
	const closeTab = new ToggleButton('close-tab', 'Close Tab', false);
	const go = new Button('go', 'Go Fullscreen');

	openInSelect.element.onchange = function (element) {
		const index = element.target.selectedIndex;
		chrome.storage.sync.set({ openIn: index }, null);
		updateCloseTabUIVisibility(index);
	};

	closeTab.element.onclick = function (element) {
		localCloseTab = !localCloseTab;
		updateCloseTabUI();
		chrome.storage.sync.set({ closeTab: localCloseTab }, null);
	};

	go.element.onclick = function (element) {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
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
	
			chrome.storage.sync.get('openIn', function (data) {
				const url = 'https://www.youtube.com/embed/' + videoId;
	
				const openIn = data.openIn;
				if (openIn === 0) {        // Open in current tab.
					chrome.tabs.update({ url: url }, null);
				} else if (openIn === 1) { // Open in new tab.
					if (localCloseTab) chrome.tabs.remove(activeTab.id, null);
					chrome.tabs.create({ url: url }, null);
				} else if (openIn === 2) { // Open in new window.
					if (localCloseTab) chrome.tabs.remove(activeTab.id, null);
					chrome.windows.create({ url: url, type: 'normal', width: 1280, height: 720 }, null);
				} else if (openIn === 3) { // Open in popup window.
					if (localCloseTab) chrome.tabs.remove(activeTab.id, null);
					chrome.windows.create({ url: url, type: 'popup', width: 1280, height: 720 }, null);
				}
			});
		});
	};

	// Load current state from storage
	chrome.storage.sync.get('openIn', function (data) {
		if (data.openIn === undefined) return;
		openInSelect.element.selectedIndex = data.openIn;
		updateCloseTabUIVisibility(openInSelect.element.selectedIndex);
	});
	chrome.storage.sync.get('closeTab', function (data) {
		if (data.closeTab === undefined) return;
		localCloseTab = data.closeTab;
		updateCloseTabUI();
	});

	// Utility functions
	function updateCloseTabUI() {
		if (localCloseTab) {
			closeTab.element.classList.remove('toggle-button-inactive');
			closeTab.element.classList.add('toggle-button-active');
		} else {
			closeTab.element.classList.remove('toggle-button-active');
			closeTab.element.classList.add('toggle-button-inactive');
		}
	}
	
	function updateCloseTabUIVisibility(index) {
		if (index === 0) {
			closeTab.hide();
		} else {
			closeTab.show();
		}
	}
};