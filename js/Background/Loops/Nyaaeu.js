define(function (require) {
    var NAMESPACE = "Background/Loops";
    var Data = require("Base/Data");
    var Synchronized = require("Base/Synchronized");
    var KirinoSettings = require("Kirino/Settings");

    let NyaaeuParser = require("Parsers/Nyaaeu");
    var Anime = require("Kirino/Types/Anime");
    var Episode = require("Kirino/Types/Episode");

    var SearchGenerator = require("Kirino/Helpers/SearchGenerator");

    let LOOP_NAME = "nyaaeuLoop";
    let DELAY = 1 * 60 * 1000;

    return class Nyaaeu extends require("Background/Loops/ALoop") {
        constructor() {
            super();
            this.kirino = new Synchronized(KirinoSettings.namespace);
        }

        start(ids, forced = false) {
            if (ids) {
                this._findTorrents(ids);
                return;
            }
            let THIS = this;
            let o = {};
            o[LOOP_NAME] = 0;
            Data.get(o, function (keys) {
                let last = keys[LOOP_NAME] ? keys[LOOP_NAME] : 0;
                THIS.kirino.get({
                    "anime": [],
                    "nyaaRefreshRate": "00:00"
                }).then((kirino) => {
                    if (forced || Nyaaeu.TODAY - last > THIS._timeToMs(kirino["nyaaRefreshRate"])) {
                        THIS._findTorrents(kirino['anime']);
                        o[LOOP_NAME] = Data.timestamp();
                        Data.set(o);
                    }
                });
            });
        }

        _findTorrents(ids) {
            console.log("Getting Nyaa.eu data: " + new Date(), ids);
            let THIS = this;
            let TODAY = Nyaaeu.TODAY;
            Anime.getAll(ids).then((shows) => {
                let episodes = [];
                for (let k in shows) {
                    episodes = episodes.concat(shows[k].episodes);
                }
                Episode.getAll(episodes).then((episodes) => {
                    let k = 0;
                    for (let i in episodes) {
                        let e = episodes[i];
                        if (e.date < TODAY && !e.found) {
                            setTimeout(() => {
                                let search = SearchGenerator.generate(e.number, shows[e.thing].searchText, Anime);
                                NyaaeuParser.getData(search).then((items) => {
                                    if (items.length > 0) {
                                        THIS._notify(
                                            "Nyaa.eu: " + items[0].title,
                                            items[0].guid,
                                            "download"
                                        );
                                        (new Episode(e.id)).set("found", true);
                                    }
                                });
                            }, DELAY * k++);
                        }
                    }
                });
            });
        }
    };
});