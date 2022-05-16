chrome.runtime.onMessage.addListener((message, sender, reply) => {
    const data = {
        text: message.text
    };
    if (message.hasOwnProperty('tabId')) {
        data['tabId'] = sender.tab.id;
    }
    chrome.action.setBadgeText(data);
});

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['action.js']
    });
});
