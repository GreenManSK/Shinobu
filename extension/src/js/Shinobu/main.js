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
    require(["lib/jquery"], function () {
        require(["lib/ui.position.min", "lib/contextMenu.min", "lib/jquery-ui.min", "lib/jquery.typing-0.2.0.min"], function () {
            $(function () {
                start();
            });
        });
    });

    var Data = require("Base/Data");
    require("Base/Synchronized");
    require("Base/Translator");
    require("Base/Notifications");
    require("Base/Form");
    require("Base/EntityForm");

    require("Parsers/SiteParser");

    require("Kirino/Render/Icon");

    require("Shinobu/Form/IconForm");
    require("Shinobu/Types/Note");
    require("Shinobu/Types/Tab");
    require("Shinobu/Types/Icon");

    var PanelNote = require("Shinobu/Render/PanelNote");
    var QuickAccess = require("Shinobu/Render/QuickAccess");

    var MainMenu = require("Base/MainMenu");
    var Notifications = require("Base/Notifications");


    function start() {
        translateWholeDom();

        var panelNote = new PanelNote();
        var quickAccess = new QuickAccess(panelNote);
        MainMenu.start();

        Notifications.start();
        panelNote.render();
        quickAccess.render();
    }
});