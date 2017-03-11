define(function (require) {
    var NAMESPACE = "Background/Messages";

    class Dispatcher {
        constructor() {
            this.listen = {};
        }

        start() {
            let THIS = this;
            chrome.runtime.onMessage.addListener(function () {
                THIS._dispatchMessage.apply(THIS, arguments);
            });
            console.log("Listening to messages...");
        }

        _dispatchMessage(message, sender, sendResponse) {
            if (typeof  message !== 'object' || !message.hasOwnProperty("name")) {
                if (sendResponse)
                    sendResponse(false, "Invalid message");
                return;
            }
            let match = message.name.match(/^([^.]*)\.(.*)$/);
            if (match === null) {
                if (sendResponse)
                    sendResponse(false, "Invalid message name");
                return;
            }
            let namespace = match[1];
            message.name = match[2];
            if (!this.listen.hasOwnProperty(namespace)) {
                if (sendResponse)
                    sendResponse(false, "Invalid namespace");
                return;
            }
            for (let i in this.listen[namespace]) {
                this.listen[namespace][i].onMessage(message, sender, sendResponse);
            }
        }

        addListener(namespace, listener) {
            if (!this.listen.hasOwnProperty(namespace)) {
                this.listen[namespace] = []
            }
            this.listen[namespace].push(listener);
        }

        removeListener(namespace, listener) {
            if (this.listen.hasOwnProperty(namespace)) {
                let index = this.listen[namespace].indexOf(listener);
                if (index > -1) {
                    this.listen[namespace].splice(index, 1);
                }
            }
        }
    }

    return new Dispatcher();
});