//RequireJs Configuration
requirejs.config({
    baseUrl: 'js', // Require starts in js directory
    paths: {
        lib: '../libs'
    }
});

var MAIN_LOOP_ALARM = "mainLoop";

define(function (require) {
    "use strict";
    var Data = require("Base/Data");
    require("Base/Synchronized");
    require("Base/Translator");

    var DefualtSetter = require("Background/DefualtSetter");
    var dispatcher = require("Background/Messages/Dispatcher");
    require("Background/Messages/Badge");
    require("Background/Messages/ExtensionNotifications");

    require("Kirino/Settings");
    require("Kirino/Types/AEpisodic");
    var Anime = require("Kirino/Types/Anime");
    var Show = require("Kirino/Types/Show");
    var OVA = require("Kirino/Types/OVA");
    var Music = require("Kirino/Types/Music");
    var Episode = require("Kirino/Types/Episode");

    var KirinoNotify = require("Background/Loops/KirinoNotify");

    DefualtSetter.set().then(() => {
        dispatcher.start();

        let notifiers = [
            new KirinoNotify()
        ];
        chrome.alarms.onAlarm.addListener(function (alarm) {
            if (alarm.name === MAIN_LOOP_ALARM) {
                console.log("Main loop executions:" + new Date());
                for (let i in notifiers) {
                    notifiers[i].start();
                }
            }
        });

        chrome.runtime.onInstalled.addListener(function () {
            chrome.alarms.create(MAIN_LOOP_ALARM, {
                when: Date.now() + 5 * 1000,
                periodInMinutes: 30
            });
            dispatcher._dispatchMessage({name: "extensionNotifications.reload"});
        });
    });
});