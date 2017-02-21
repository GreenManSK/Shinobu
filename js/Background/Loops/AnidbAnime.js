define(function (require) {
    var NAMESPACE = "Background/Loops";
    var Data = require("Base/Data");
    var Synchronized = require("Base/Synchronized");
    var KirinoSettings = require("Kirino/Settings");

    let AnidbAnimeParser = require("Parsers/AnidbAnime");
    var Anime = require("Kirino/Types/Anime");
    var Episode = require("Kirino/Types/Episode");

    return class AnidbAnime extends require("Background/Loops/AEpisodeLoop") {
        constructor() {
            super();
        }

        get LOOP_NAME() {
            return "anidbAnimeLoop";
        }

        get DELAY() {
            return 3 * 60 * 1000;
        }

        get REFRESH_RATE_NAME() {
            return "anidbRefreshRate";
        }

        get TYPE_NAME() {
            return "anime";
        }

        get THING_CLASS() {
            return Anime;
        }

        get PARSER_CLASS() {
            return AnidbAnimeParser;
        }

        get ID_KEY() {
            return "anidbId";
        }

        _getNewEpisodes(ids, maxEpisodes) {
            console.log("Getting AniDB Anime data: " + new Date(), ids);
            super._getNewEpisodes(ids, maxEpisodes);
        }

        _add(anime, ids) {
            let start = new Promise((cb) => cb());
            let animeObj = new Anime(anime.id);
            for (let i in ids) {
                let e = ids[i];
                start = start.then(() => {
                    return Episode.create(animeObj, e.number, e.date.getTime());
                });
            }
        }
    };
});