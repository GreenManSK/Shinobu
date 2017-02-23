define(function (require) {
    var NAMESPACE = "Kirino/Types";
    var Synchronized = require("Base/Synchronized");
    var AEpisodic = require("Kirino/Types/AEpisodic");

    class Episode extends Synchronized {
        static create(thing,
                      number,
                      date,
                      found = false,
                      seen = false,
                      notified = false) {
            return super.create().then((obj) => {
                    return obj.set({
                            number: number,
                            date: date,
                            found: found,
                            seen: seen,
                            notified: notified
                        }
                    );
                }
            ).then((obj) => {
                return obj.addThing(thing, number);
            });
        }

        addThing(thing, episodeNumber) {
            return this.set({
                "thing": thing.id
            }).then((obj) => {
                return thing.set({
                    episodes: AEpisodic.arrayAdder(this.id),
                    lastEpisode: (old) => Math.max(episodeNumber, old)
                }).then((thingObj) => {
                    return obj;
                });
            });
        }

        static attributes() {
            return super.attributes().concat(["number", "date", "found", "seen", "thing", "notified"]);
        }
    }

    Synchronized._registerClass(Episode);

    return Episode;
});