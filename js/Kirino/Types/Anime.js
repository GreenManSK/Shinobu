var NAMESPACE = "Kirino/Types";
define(function (require) {

    return class Anime extends require("Kirino/Types/AEpisodic") {
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
                    );
                }
            );
        }

        static attributes() {
            return super.attributes().concat(["anidbId", "name", "searchText", "lastEpisodeRefresh", "lastSearchRefresh"]);
        }

        static decodeEpisodeNumber(number) {
            return number;
        }
    };
});