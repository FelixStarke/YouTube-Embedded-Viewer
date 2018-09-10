chrome.runtime.onInstalled.addListener(function () {

    // 0: this tab
    // 1: new tab
    // 2: new window
    // 3: popup
    chrome.storage.sync.set({ openIn: 0, closeTab: false }, null);

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({ pageUrl: { urlContains: 'youtube.com/watch?' } })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});
