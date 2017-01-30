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
    require(["lib/jquery", "lib/date"], function () {
        require(["lib/ui.position.min", "lib/contextMenu.min"], function () {
            $(function () {
                start();
            });
        });
    });


    var Data = require("Base/Data");
    require("Base/Synchronized");
    require("Base/Translator");
    var Notifications = require("Base/Notifications");
    var Form = require("Base/Form");
    var EntityForm = require("Base/EntityForm");

    var BasicRender = require("Kirino/Render/BasicRender");
    require("Kirino/Render/Icon");
    require("Kirino/Settings");

    var Linker = require("Form/Linker");
    var BoxEntityForm = require("Form/BoxEntityForm");

    require("Form/Entity/ova");
    require("Form/Entity/music");
    require("Form/Entity/anime");
    require("Form/Entity/show");

    let parsedUrl = Linker.parseUrl();
    let formClass = require(parsedUrl.module);
    let form = new formClass(parsedUrl.id);

    function start() {
        translateWholeDom();
        Notifications.start();

        form.showLabels(true);
        form.render(".box");
    }
});