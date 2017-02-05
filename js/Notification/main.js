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
    require("Base/Synchronized");
    require("Base/Translator");
    var MainMenu = require("Base/MainMenu");

    var BasicRender = require("Kirino/Render/BasicRender");

    var Linker = require("Form/Linker");

    let BaseParser = require("Parsers/BaseParser");
    let Anison = require("Parsers/Anison");
    let AnidbAnime = require("Parsers/AnidbAnime");

    var Render = require("Notification/Render");
    let r = new Render();

    r.addParser(Anison);
    r.addParser(AnidbAnime);

    function start() {
        translateWholeDom();
        Data.get("developerMode", (items) => {
            if (items.developerMode)
                MainMenu.start(true);
        });
        r.renderAdd("div.add");
        r.render("div.notifications");
    }
});