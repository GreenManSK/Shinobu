//RequireJs Configuration
requirejs.config({
    baseUrl: 'js', // Require starts in js directory
    paths: {
        lib: '../libs'
    }
});

let AnidbAnime;

define(function (require) {
    "use strict";

    require("lib/jquery");

    var Data = require("Base/Data");
    require("Base/Synchronized");
    require("Base/Translator");
    var Notifications = require("Base/Notifications");

    let BaseParser = require("Parsers/BaseParser");
    let Anison = require("Parsers/Anison");
    AnidbAnime = require("Parsers/AnidbAnime");
});