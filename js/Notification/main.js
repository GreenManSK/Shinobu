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

    var Render = require("Notification/Render");
    let r = new Render();

    function start() {
        translateWholeDom();
        Data.get("developerMode", (items) => {
            if (items.developerMode)
                MainMenu.start(true);
        });
        r.render("div.notifications");
    }
});