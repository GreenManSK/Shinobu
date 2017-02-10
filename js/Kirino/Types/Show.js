var NAMESPACE = "Kirino/Types";
define(function (require) {
    return class Show extends require("Kirino/Types/AEpisodic") {
        static create(thetvdbId,
                      name,
                      searchText = null,
                      lastEpisodeRefresh = null,
                      lastSearchRefresh = null) {
            return super.create().then((obj) => {
                    return obj.set({
                            name: name,
                            thetvdbId: thetvdbId,
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
            return super.attributes().concat(["name", "thetvdbId", "searchText", "lastEpisodeRefresh", "lastSearchRefresh"]);
        }

        static decodeEpisodeNumber(number) {
            let text = "S" + Show.pad(Show.getEpisode(number), 2);
            text += "E" + Show.pad(Show.getSeason(number), 2);

            return text;
        }

        static getEpisode(number) {
            return Math.floor(number / 1000);
        }

        static getSeason(number) {
            return number - Math.floor(number / 1000) * 1000;
        }

    };
});