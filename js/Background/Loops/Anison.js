define(function (require) {
    var NAMESPACE = "Background/Loops";
    var Data = require("Base/Data");
    var Synchronized = require("Base/Synchronized");
    var KirinoSettings = require("Kirino/Settings");

    let AnisonParser = require("Parsers/Anison");
    var Music = require("Kirino/Types/Music");

    let LOOP_NAME = "anisonLoop";
    let DELAY = 1 * 60 * 1000;

    return class Anison extends require("Background/Loops/ALoop") {
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
                    "music": [],
                    "anisonRefreshRate": "00:00"
                }).then((kirino) => {
                    if (forced || Anison.TODAY - last > THIS._timeToMs(kirino["anisonRefreshRate"])) {
                        THIS._getDates(kirino['music']);
                        o[LOOP_NAME] = Anison.TODAY;
                        Data.set(o);
                    }
                });
            });
        }

        _getDates(ids) {
            console.log("Getting Anison data: " + new Date(), ids);
            Music.getAll(ids).then((elements) => {
                let k = 0;
                for (let i in elements) {
                    let e = elements[i];
                    if (e.anisonId && !e.date) {
                        setTimeout(() => {
                            AnisonParser.getData(e.anisonId).then((data) => {
                                let set = {};
                                if (data.date) {
                                    set["date"] = data.date.getTime();
                                }
                                if (!e.title && data.title) {
                                    set["title"] = data.title;
                                }
                                if (!e.author && data.author) {
                                    set["author"] = data.author;
                                }
                                if (Object.keys(set).length > 0) {
                                    (new Music(e.id)).set(set);
                                }
                            });
                        }, DELAY * k++);
                    }
                }
            });
        }
    };
});