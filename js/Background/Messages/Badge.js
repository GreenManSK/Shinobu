define(function (require) {
    var NAMESPACE = "Background/Messages";
    let dispatcher = require("Background/Messages/Dispatcher");

    class Badge {
        constructor() {
        }

        onMessage(message, sender, sendResponse) {
            let object;
            switch (message.name) {
                case "text":
                    object = {
                        text: message.text
                    };
                    if (message.hasOwnProperty("tabId"))
                        object["tabId"] = sender.tab.id === true ? message.tabId : sender.tab.id;
                    chrome.browserAction.setBadgeText(object);
                    break;
                case "color":
                    object = {
                        color: message.color
                    };
                    if (message.hasOwnProperty("tabId"))
                        object[tabid] = message.tabId;
                    chrome.browserAction.setBadgeBackgroundColor(object);
                    break;
            }
        }
    }

    dispatcher.addListener("badge", new Badge());
});