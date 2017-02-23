define(function (require) {
    var NAMESPACE = "Kirino/Types";
    var Synchronized = require("Base/Synchronized");

    class Anime extends require("Kirino/Types/AEpisodic") {
        static create(anidbId,
                      name,
                      searchText = null,
                      lastEpisodeRefresh = null,
                      lastSearchRefresh = null) {
            return super.create().then((obj) => {
                    return obj.set({
                            name: name,
                            anidbId: anidbId,
                            searchText: searchText,
                            lastEpisodeRefresh: lastEpisodeRefresh,
                            lastSearchRefresh: lastSearchRefresh
                        }
                    ).then(() => {
                        return obj;
                    });
                }
            );
        }

        static attributes() {
            return super.attributes().concat(["anidbId", "name", "searchText", "lastEpisodeRefresh", "lastSearchRefresh"]);
        }

        static decodeEpisodeNumber(number) {
            return number;
        }
    }

    Synchronized._registerClass(Anime);

    return Anime;
});