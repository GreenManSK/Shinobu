define(function (require) {
    var NAMESPACE = "Background/Loops";
    let dispatcher = require("Background/Messages/Dispatcher");
    var Data = require("Base/Data");
    var Synchronized = require("Base/Synchronized");
    var KirinoSettings = require("Kirino/Settings");

    let AnidbEpisodeParser = require("Parsers/AnidbEpisode");
    var OVA = require("Kirino/Types/OVA");

    let LOOP_NAME = "anidbEpisodeLoop";
    let DELAY = 2.7 * 60 * 1000;

    return class AnidbEpisode extends require("Background/Loops/ALoop") {
        constructor() {
            super();
            this.kirino = new Synchronized(KirinoSettings.namespace);
        }

        start(ids, forced = false) {
            if (ids) {
                this._getDates(ids);
                return;
            }
            let THIS = this;
            let o = {};
            o[LOOP_NAME] = 0;
            Data.get(o, function (keys) {
                let last = keys[LOOP_NAME] ? keys[LOOP_NAME] : 0;
                THIS.kirino.get({
                    "ova": [],
                    "anidbRefreshRate": "00:00"
                }).then((kirino) => {
                    if (forced || AnidbEpisode.NOW - last > THIS._timeToMs(kirino["anidbRefreshRate"])) {
                        THIS._getDates(kirino['ova']);
                        o[LOOP_NAME] = AnidbEpisode.NOW;
                        Data.set(o);
                    }
                });
            });
        }

        _getDates(ids) {
            console.log("Getting AnidbEpisode data: " + new Date(), ids);
            OVA.getAll(ids).then((elements) => {
                let k = 0;
                for (let i in elements) {
                    let e = elements[i];
                    if (e.anidbEpisodeId && !e.date) {
                        setTimeout(() => {
                            AnidbEpisodeParser.getData(e.anidbEpisodeId).then((data) => {
                                    let set = {};
                                    if (data.date) {
                                        set["date"] = data.date.getTime();
                                    }
                                    if (Object.keys(set).length > 0) {
                                        (new OVA(e.id)).set(set);
                                    }
                                }
                            );
                        }, DELAY * k++);
                    }
                }
            });
        }
    };
});