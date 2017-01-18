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
    require("lib/jquery");

    require("Base/Synchronized");
    require("Base/Translator");
    
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
    var AnimeRender = require("Kirino/Render/AnimeRender");

    // Start
    KirinoBot.say(_("kirinoWelcome"));

    var data = require("Kirino/data");

    var renders = [
        [
            new MusicRender(MusicRender.Color.BLUE, MusicRender.Column.SECOND),
            data.music
        ],
        [
            new OvaRender(OvaRender.Color.PINK, OvaRender.Column.SECOND),
            data.ova
        ],
        [
            new AnimeRender(OvaRender.Color.RED, OvaRender.Column.FIRST),
            data.anime
        ],
        [
            new ShowRender(OvaRender.Color.GREEN, ShowRender.Column.FIRST),
            data.shows
        ]
    ];
    for (var k in renders) {
        renders[k][0].render(renders[k][1]);
    }
});