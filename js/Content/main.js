let ANISON_REGEXP = new RegExp(/^https?:\/\/anison\.info\/data\/song\/(\d+)\.html/, 'i');

let regexs = [ANISON_REGEXP];

let url = window.location.toString();
for (let i in regexs) {
    if (url.match(regexs[i]) !== null) {
        chrome.runtime.sendMessage({
            name: "badge.text",
            "text": "+",
            tabId: true
        }, null);
        break;
    }
}