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
        require(["lib/ui.position.min", "lib/contextMenu.min"], function() {
            $(function () {
                start();
            });
        });
    });


    var Data = require("Base/Data");
    require("Base/Synchronized");
    require("Base/Translator");
    var Notifications = require("Base/Notifications");
    var MainMenu = require("Base/MainMenu");

    var KirinoBot = require("Kirino/KirinoBot");


    require("Kirino/Types/AEpisodic");
    var Anime = require("Kirino/Types/Anime");
    var Show = require("Kirino/Types/Show");
    var OVA = require("Kirino/Types/OVA");
    var Music = require("Kirino/Types/Music");
    var Episode = require("Kirino/Types/Episode");

    var BasicRender = require("Kirino/Render/BasicRender");
    require("Kirino/Render/Icon");
    var MusicRender = require("Kirino/Render/MusicRender");
    var OvaRender = require("Kirino/Render/OvaRender");
    var ShowRender = require("Kirino/Render/ShowRender");
    var AnimeRender = require("Kirino/Render/AnimeRender")

    var KirinoSettings = require("Kirino/Settings");

    // Start
    KirinoBot.say(_("kirinoWelcome"));

    require("Kirino/data").then((inserted) => {
        if (inserted)
            KirinoBot.say("Data inserted, we can go!");
    });


    function start() {
        translateWholeDom();
        Notifications.start();
        MainMenu.start();
        KirinoSettings.start();
    }
});