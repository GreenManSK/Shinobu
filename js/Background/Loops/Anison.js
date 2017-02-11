define(function (require) {
    var NAMESPACE = "Background/Loops";
    var Data = require("Base/Data");
    var Synchronized = require("Base/Synchronized");
    var KirinoSettings = require("Kirino/Settings");

    let AnisonParser = require("Parsers/Anison");
    var Music = require("Kirino/Types/Music");

    let LOOP_NAME = "anisonLoop";

    return class Anison extends require("Background/Loops/ALoop") {
        constructor() {
            super();
            this.kirino = new Synchronized(KirinoSettings.namespace);
        }

        start() {
            let THIS = this;
            let o = {};
            o[LOOP_NAME] = 0;
            Data.get(o, function (keys) {
                let last = keys[LOOP_NAME] ? keys[LOOP_NAME] : 0;
                THIS.kirino.get({
                    "music": [],
                    "anisonRefreshRate": "00:00"
                }).then((kirino) => {
                    if (Anison.TODAY - last > THIS._timeToMs(kirino["anisonRefreshRate"])) {
                        console.log("Getting Anison data: " + new Date());
                        THIS._getDates(kirino['music']);
                        o[LOOP_NAME] = Anison.TODAY;
                        Data.set(o);
                    }
                });
            });
        }

        _getDates(ids) {
            Music.getAll(ids).then((elements) => {
                for (let i in elements) {
                    let e = elements[i];
                    if (e.anisonId && !e.date) {
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
                    }
                }
            });
        }
    };
});