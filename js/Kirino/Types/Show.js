var NAMESPACE = "Kirino/Types";
define(function (require) {
    return class Show extends require("Kirino/Types/AEpisodic") {
        static create(nextEpisodeId,
                      name,
                      searchText = null,
                      lastEpisodeRefresh = null,
                      lastSearchRefresh = null) {
            return super.create().then((obj) => {
                    return obj.set({
                            name: name,
                            nextEpisodeId: nextEpisodeId,
                            searchText: searchText,
                            lastEpisodeRefresh: lastEpisodeRefresh,
                            lastSearchRefresh: lastSearchRefresh
                        }
                    );
                }
            );
        }

        static attributes() {
            return super.attributes().concat(["name", "nextEpisodeId", "searchText", "lastEpisodeRefresh", "lastSearchRefresh"]);
        }

        static decodeEpisodeNumber(number) {
            let text = "S" + Show.pad(Math.floor(number / 1000), 2);
            text += "E" + Show.pad(number - Math.floor(number / 1000) * 1000, 2);

            return text;
        }

    };
});