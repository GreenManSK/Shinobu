//RequireJs Configuration
requirejs.config({
    baseUrl: 'js', // Require starts in js directory
    paths: {
        lib: '../libs'
    }
});

let TheTVDB;

define(function (require) {
    "use strict";

    require("lib/jquery");

    var Data = require("Base/Data");
    require("Base/Synchronized");
    require("Base/Translator");
    var Notifications = require("Base/Notifications");

    let BaseParser = require("Parsers/BaseParser");
    let Anison = require("Parsers/Anison");
    let AnidbAnime = require("Parsers/AnidbAnime");
    let AnidbSong = require("Parsers/AnidbSong");
    let AnidbEpisode = require("Parsers/AnidbEpisode");
    TheTVDB = require("Parsers/TheTVDB");
});