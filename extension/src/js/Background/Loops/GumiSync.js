define(function (require) {
    var NAMESPACE = "Background/Loops";
    var Data = require("Base/Data");
    var Synchronized = require("Base/Synchronized");
    var Gumi = require("Gumi/Gumi");

    let LOOP_NAME = "gumiLoop";

    return class GumiSync extends require("Background/Loops/ALoop") {
        constructor() {
            super();
            this.gumi = new Synchronized("Gumi");
        }

        start() {
            let THIS = this;
            let o = {};
            o[LOOP_NAME] = 0;
            Data.get(o, function (keys) {
                let last = keys[LOOP_NAME] ? keys[LOOP_NAME] : 0;
                THIS.gumi.get({
                    "music": [],
                    "backupRefreshRate": "00:00"
                }).then((gumi) => {
                    if (GumiSync.NOW - last > THIS._timeToMs(gumi["backupRefreshRate"])) {
                        THIS._startSync();
                    }
                });
            });
        }

        _startSync() {
            console.log("c");
            Gumi.backup((success) => {
                if (success) {
                    let o = {};
                    o[LOOP_NAME] = GumiSync.NOW;
                    Data.set(o);
                    console.log("Backup completed");
                }
            });
        }
    }
});
