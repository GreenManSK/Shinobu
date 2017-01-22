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
    var MainMenu = require("Base/MainMenu");
    var Form = require("Base/Form");

    var BasicRender = require("Kirino/Render/BasicRender");
    require("Kirino/Render/Icon");

    var KirinoSettings = require("Kirino/Settings");


    var shinobuSettings = {
        developerMode: {
            type: Form.TYPE.CHECKBOX,
            label: "developerMode"
        },
        notificationFadeTime: {
            type: Form.TYPE.NUMBER,
            label: "notificationFadeTime",
            default: 4000,
            attrs: {
                min: 1000
            }
        },
        syncRefreshRate: {
            type: Form.TYPE.TIME,
            label: "syncRefreshRate",
            default: "01:02"
        },
        submit: {
            type: Form.TYPE.SUBMIT,
            label: "save"
        }
    };

    var kirinoSettings = {
        "maxEpisodes": {
            type: Form.TYPE.NUMBER,
            label: "maxEpisodesPerThing",
            default: 4,
            attrs: {
                min: 1
            }
        },
        anidbRefreshRate: {
            type: Form.TYPE.TIME,
            label: "anidbRefreshRate",
            default: "03:00"
        },
        nyaaRefreshRate: {
            type: Form.TYPE.TIME,
            label: "nyaaRefreshRate",
            default: "00:30"
        },
        anisonRefreshRate: {
            type: Form.TYPE.TIME,
            label: "anisonRefreshRate",
            default: "06:00"
        },
        vgmdbRefreshRate: {
            type: Form.TYPE.TIME,
            label: "vgmdbRefreshRate",
            default: "06:00"
        },
        submit: {
            type: Form.TYPE.SUBMIT,
            label: "save"
        }
    };

    function start() {
        translateWholeDom();
        Notifications.start();
        MainMenu.start();

        var shinobuForm = new Form(shinobuSettings);
        var kirinoForm = new Form(kirinoSettings);

        shinobuForm.showLabels(true);
        kirinoForm.showLabels(true);

        shinobuForm.render('.box.shinobu');
        kirinoForm.render('.box.kirino');
    }
});