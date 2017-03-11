//RequireJs Configuration
requirejs.config({
    baseUrl: 'js', // Require starts in js directory
    paths: {
        lib: '../libs'
    }
});

define(function (require) {
    "use strict";

    // Requires
    require("https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.1/less.min.js");
    less.env = "development";
    less.watch();
    var md5 = require("lib/md5");
    require(["lib/jquery"], function () {
        $(function () {
            start();
        });
    });

    var Data = require("Base/Data");
    var Synchronized = require("Base/Synchronized");
    require("Base/Translator");
    var MainMenu = require("Base/MainMenu");

    var BasicRender = require("Kirino/Render/BasicRender");

    var Linker = require("Form/Linker");

    let BaseParser = require("Parsers/BaseParser");
    let Anison = require("Parsers/Anison");
    let AnidbAnime = require("Parsers/AnidbAnime");
    let AnidbSong = require("Parsers/AnidbSong");
    let AnidbEpisode = require("Parsers/AnidbEpisode");
    let TheTVDB = require("Parsers/TheTVDB");

    var Render = require("Notification/Render");
    let r = new Render();

    r.addParser(Anison);
    r.addParser(AnidbAnime);
    r.addParser(AnidbSong);
    r.addParser(AnidbEpisode);
    r.addParser(TheTVDB);

    function start() {
        translateWholeDom();
        (new Synchronized("Shinobu")).get("developerMode").then((value) => {
            if (value)
                MainMenu.start(true);
        });
        r.renderAdd("div.add");
        r.render("div.notifications");
    }
});