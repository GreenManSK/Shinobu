define(function (require) {
    var NAMESPACE = "Background";
    var Synchronized = require("Base/Synchronized");

    let SHINOBU_DEFAULTS = {
        developerMode: false,
        maxNotificationNumber: 20,
        notificationColor: "#3385AD",
        notificationFadeTime: 4000,
        // syncRefreshRate: "01:02"
    };

    if (typeof _ === "undefined") {
        function _(x) {
            return x;
        }
    }

    let KIRINO_DEFAULTS = {
        getNewDataAuto: true,
        maxEpisodes: 2,
        anidbRefreshRate: "06:00",
        nyaaRefreshRate: "01:00",
        anisonRefreshRate: "12:00",
        tvdbRefreshRate: "06:00",
        show: [],
        ova: [],
        anime: [],
        music: [],
        nyaaDomain: ''
    };

    let GUMI_DEFAULTS = {
        computerName: _("defaultComputerName"),
        serverUrl: "",
        publicKey: "",
        backupRefreshRate: "23:59",
        automaticBackup: false
    };

    return class DefualtSetter {
        static set() {
            return new Promise((cb) => {
                let Shinobu = new Synchronized("Shinobu");
                let Kirino = new Synchronized("Kirino");
                let Gumi = new Synchronized("Gumi");
                Shinobu._timestamp = () => {
                    return 0
                };
                Kirino._timestamp = () => {
                    return 0
                };

                Shinobu.get(SHINOBU_DEFAULTS).then((values) => {
                    return Shinobu.set(values);
                }).then(() => {
                    return Kirino.get(KIRINO_DEFAULTS);
                }).then((values) => {
                    return Kirino.set(values);
                }).then(() => {
                    return Gumi.get(GUMI_DEFAULTS)
                }).then((values) => {
                    return Gumi.set(values);
                }).then(() => {
                    cb();
                });
            });
        }
    }
});
