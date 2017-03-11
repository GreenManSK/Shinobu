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

    var BoxEntityForm = require("Form/BoxEntityForm");

    var BasicRender = require("Kirino/Render/BasicRender");
    require("Kirino/Render/Icon");

    var KirinoSettings = require("Kirino/Settings");

    var shinobuSettings = {
        developerMode: {
            type: Form.TYPE.CHECKBOX,
            label: "developerMode"
        },
        maxNotificationNumber: {
            type: Form.TYPE.NUMBER,
            label: "maxNotificationNumber",
            attrs: {
                min: 1
            }
        },
        notificationColor: {
            type: Form.TYPE.TEXT,
            label: "notificationColor"
        },
        notificationFadeTime: {
            type: Form.TYPE.NUMBER,
            label: "notificationFadeTime",
            attrs: {
                min: 1000
            }
        },
        syncRefreshRate: {
            type: Form.TYPE.TIME,
            label: "syncRefreshRate"
        },
        submit: {
            type: Form.TYPE.SUBMIT,
            label: "save"
        }
    };

    var shinobuCallback = function() {
        chrome.runtime.sendMessage({name: "extensionNotifications.reload"}, null);
    };

    var kirinoSettings = {
        getNewDataAuto: {
            type: Form.TYPE.CHECKBOX,
            label: "getNewDataAuto"
        },
        "maxEpisodes": {
            type: Form.TYPE.NUMBER,
            label: "maxEpisodesPerThing",
            attrs: {
                min: 1
            }
        },
        anidbRefreshRate: {
            type: Form.TYPE.TIME,
            label: "anidbRefreshRate"
        },
        nyaaRefreshRate: {
            type: Form.TYPE.TIME,
            label: "nyaaRefreshRate"
        },
        anisonRefreshRate: {
            type: Form.TYPE.TIME,
            label: "anisonRefreshRate"
        },
        tvdbRefreshRate: {
            type: Form.TYPE.TIME,
            label: "tvdbRefreshRate"
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

        var shinobuForm = new BoxEntityForm("shinobu", BasicRender.Color.CYAN, null, "Shinobu", shinobuSettings, shinobuCallback);
        var kirinoForm = new BoxEntityForm("kirino", BasicRender.Color.YELLOW, null, "Kirino", kirinoSettings);

        shinobuForm.showLabels(true);
        kirinoForm.showLabels(true);

        shinobuForm.render('.box.shinobu');
        kirinoForm.render('.box.kirino');
    }
});