define(function (require) {
    var NAMESPACE = "Background/Loops";
    var Data = require("Base/Data");
    var Synchronized = require("Base/Synchronized");
    var KirinoSettings = require("Kirino/Settings");

    let AnidbSongParser = require("Parsers/AnidbSong");
    var Music = require("Kirino/Types/Music");

    let LOOP_NAME = "anidbSongLoop";
    let DELAY = 2 * 60 * 1000;

    return class AnidbSong extends require("Background/Loops/ALoop") {
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
                    "anidbRefreshRate": "00:00"
                }).then((kirino) => {
                    if (forced || AnidbSong.TODAY - last > THIS._timeToMs(kirino["anidbRefreshRate"])) {
                        THIS._getDates(kirino['music']);
                        o[LOOP_NAME] = Data.timestamp();
                        Data.set(o);
                    }
                });
            });
        }

        _getDates(ids) {
            console.log("Getting AnidbSong data: " + new Date(), ids);
            Music.getAll(ids).then((elements) => {
                let k = 0;
                for (let i in elements) {
                    let e = elements[i];
                    if (e.anidbId && !e.anisonId) {
                        setTimeout(() => {
                            AnidbSongParser.getData(e.anidbId).then((data) => {
                                let set = {};
                                if (data.anisonId) {
                                    set["anidbId"] = data.anidbId;
                                }
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