define(function (require) {
    var NAMESPACE = "Background/Loops";
    var Data = require("Base/Data");
    var Synchronized = require("Base/Synchronized");
    var KirinoSettings = require("Kirino/Settings");

    let TheTVDBParser = require("Parsers/TheTVDB");
    var Show = require("Kirino/Types/Show");
    var Episode = require("Kirino/Types/Episode");

    return class TVDBnet extends require("Background/Loops/AEpisodeLoop") {
        constructor() {
            super();
        }

        get LOOP_NAME() {
            return "TVDBnetLoop";
        }

        get DELAY() {
            return 0.7 * 60 * 1000;
        }

        get REFRESH_RATE_NAME() {
            return "tvdbRefreshRate";
        }

        get TYPE_NAME() {
            return "show";
        }

        get THING_CLASS() {
            return Show;
        }

        get PARSER_CLASS() {
            return TheTVDBParser;
        }

        get ID_KEY() {
            return "thetvdbId";
        }

        _getEpisodes(ids, maxEpisodes) {
            console.log("Getting TVDBnet data: " + new Date(), ids);
            super._getEpisodes(ids, maxEpisodes);
        }

        _add(show, ids) {
            let start = new Promise((cb) => cb());
            let showObj = new Show(show.id);
            for (let i in ids) {
                let e = ids[i];
                start.then(() => {
                    return Episode.create(showObj, Show.createNumber(e.episode, e.season), e.date.getTime());
                });
            }
        }
    };
});