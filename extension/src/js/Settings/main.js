//RequireJs Configuration
requirejs.config({
    baseUrl: 'js', // Require starts in js directory
    paths: {
        lib: '../libs'
    }
});
var forge;
define(function (require) {
    "use strict";

    // Requires
    require("https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.1/less.min.js");
    less.env = "development";
    less.watch();
    var md5 = require("lib/md5");
    forge = require("lib/forge.min");

    require(["lib/jquery"], function () {
        require(["lib/ui.position.min", "lib/contextMenu.min"], function () {
            $(function () {
                start();
            });
        });
    });


    var Data = require("Base/Data");
    var Synchronized = require("Base/Synchronized");
    require("Base/Translator");
    var Notifications = require("Base/Notifications");
    var MainMenu = require("Base/MainMenu");
    var Form = require("Base/Form");

    require("Gumi/Gumi");
    require("Gumi/Alert");

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
        // syncRefreshRate: {
        //     type: Form.TYPE.TIME,
        //     label: "syncRefreshRate"
        // },
        submit: {
            type: Form.TYPE.SUBMIT,
            label: "save"
        }
    };

    var shinobuCallback = function () {
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
        nyaaDomain: {
            type: Form.TYPE.URL,
            label: "nyaaUrl",
            validators: [
                [Form.VALIDATION.URL_OR_EMPTY, "invalidUrl"]
            ]
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

    var gumiSettings = {
        computerName: {
            type: Form.TYPE.TEXT,
            label: "computerName",
            validators: [
                [Form.VALIDATION.REQUIERED, "needToFill"]
            ]
        },
        serverUrl: {
            type: Form.TYPE.URL,
            label: "serverUrl",
            validators: [
                [Form.VALIDATION.URL_OR_EMPTY, "invalidUrl"]
            ]
        },
        automaticBackup: {
            type: Form.TYPE.CHECKBOX,
            label: "automaticBackup"
        },
        backupRefreshRate: {
            type: Form.TYPE.TIME,
            label: "backupRefreshRate"
        },
        publicKey: {
            type: Form.TYPE.TEXTAREA,
            label: "publicKey",
            rows: 5
        },
        submit: {
            type: Form.TYPE.SUBMIT,
            label: "save"
        }
    }

    var gumiCallbaclk = function () {
        chrome.runtime.sendMessage({
            name: "mainMenu.redraw"
        }, null);
        MainMenu.redraw();
    };

    function showGumiDates() {
        var Gumi = new Synchronized("Gumi");
        Gumi.get({
            backupDate: null,
            syncDate: null
        }).then((values) => {
            $(".gumi .dates .backup span").text(values.backupDate != null ? new Date(values.backupDate) : _("never"));
            $(".gumi .dates .sync span").text(values.syncDate != null ? new Date(values.syncDate) : _("never"));
        });
    }

    function start() {
        translateWholeDom();
        Notifications.start();
        MainMenu.start();

        var shinobuForm = new BoxEntityForm("shinobu", BasicRender.Color.CYAN, null, "Shinobu", shinobuSettings, shinobuCallback);
        var kirinoForm = new BoxEntityForm("kirino", BasicRender.Color.YELLOW, null, "Kirino", kirinoSettings);
        var gumiForm = new BoxEntityForm("gumi", BasicRender.Color.GREEN, null, "Gumi", gumiSettings, gumiCallbaclk)

        shinobuForm.showLabels(true);
        kirinoForm.showLabels(true);
        gumiForm.showLabels(true);

        shinobuForm.render('.box.shinobu');
        kirinoForm.render('.box.kirino');
        gumiForm.render('.box.gumi');

        showGumiDates();
    }
});