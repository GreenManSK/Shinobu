define(function (require) {
    var NAMESPACE = "Kirino/Types";
    var Synchronized = require("Base/Synchronized");

    class Show extends require("Kirino/Types/AEpisodic") {
        static create(thetvdbId,
                      name,
                      searchText = null) {
            return super.create().then((obj) => {
                    return obj.set({
                            name: name,
                            thetvdbId: thetvdbId,
                            searchText: searchText
                        }
                    ).then(() => {
                        return obj;
                    });
                }
            );
        }

        static attributes() {
            return super.attributes().concat(["name", "thetvdbId", "searchText"]);
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

        static createNumber(episode, season) {
            return season * 1000 + episode;
        }

    }

    Synchronized._registerClass(Show);

    return Show;
});