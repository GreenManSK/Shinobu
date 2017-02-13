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
    require("lib/jquery");

    var Data = require("Base/Data");
    var Synchronized = require("Base/Synchronized");
    require("Base/Translator");

    var DefualtSetter = require("Background/DefualtSetter");
    var dispatcher = require("Background/Messages/Dispatcher");
    var KirinoDispatcher = require("Background/Messages/KirinoDispatcher");
    require("Background/Messages/Badge");
    require("Background/Messages/ExtensionNotifications");

    require("Kirino/Settings");
    require("Kirino/Types/AEpisodic");
    var Anime = require("Kirino/Types/Anime");
    var Show = require("Kirino/Types/Show");
    var OVA = require("Kirino/Types/OVA");
    var Music = require("Kirino/Types/Music");
    var Episode = require("Kirino/Types/Episode");

    let BaseParser = require("Parsers/BaseParser");
    let AnisonParser = require("Parsers/Anison");
    let AnidbAnimeParser = require("Parsers/AnidbAnime");
    let AnidbSongParser = require("Parsers/AnidbSong");
    let AnidbEpisodeParser = require("Parsers/AnidbEpisode");
    let TheTVDBParser = require("Parsers/TheTVDB");
    let NyaaeuParser = require("Parsers/Nyaaeu");

    var SearchGenerator = require("Kirino/Helpers/SearchGenerator");

    require("Background/Loops/ALoop");
    require("Background/Loops/AEpisodeLoop");
    var KirinoNotify = require("Background/Loops/KirinoNotify");
    var Anison = require("Background/Loops/Anison");
    var AnidbSong = require("Background/Loops/AnidbSong");
    var AnidbEpisode = require("Background/Loops/AnidbEpisode");
    var TVDBnet = require("Background/Loops/TVDBnet");
    var AnidbAnime = require("Background/Loops/AnidbAnime");
    var Nyaaeu = require("Background/Loops/Nyaaeu");

    DefualtSetter.set().then(() => {
        dispatcher.start();
        dispatcher._dispatchMessage({name: "extensionNotifications.reload"});
        chrome.alarms.onAlarm.addListener(function (alarm) {
            if (alarm.name === MAIN_LOOP_ALARM) {
                let kirino = new Synchronized("Kirino");
                kirino.get("getNewDataAuto").then((getNewDataAuto) => {
                    if (getNewDataAuto) {
                        console.log("Main loop executions:" + new Date());
                        dispatcher._dispatchMessage({name: "kirino.all"});
                    }
                });
            }
        });
    });

    chrome.runtime.onInstalled.addListener(function () {
        chrome.alarms.clearAll();
        chrome.alarms.create(MAIN_LOOP_ALARM, {
            when: Date.now() + 60 * 1000,
            periodInMinutes: 30
        });
    });
});