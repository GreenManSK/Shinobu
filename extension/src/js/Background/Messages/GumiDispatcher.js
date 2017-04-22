define(function (require) {
    var NAMESPACE = "Background/Messages";
    let dispatcher = require("Background/Messages/Dispatcher");
    var GumiSync = require("Background/Loops/GumiSync");


    class GumiDispacher {
        constructor() {
            this.gumiSync = new GumiSync();
        }

        onMessage(message, sender, sendResponse) {
            console.log("a");
            if (message.name === "backup") {
                console.log("b");
                this.gumiSync.start();
            }
        }
    }

    dispatcher.addListener("gumi", new GumiDispacher());
});