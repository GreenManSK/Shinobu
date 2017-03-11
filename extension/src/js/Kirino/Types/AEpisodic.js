define(function (require) {
var NAMESPACE = "Kirino/Types";
    return class AEpisodic extends require("Base/Synchronized") {
        static create() {
            return super.create().then((obj) => {
                    return obj.set({
                            episodes: [],
                            lastEpisode: 0,
                            showAll: true
                        }
                    );
                }
            );
        }

        static pad(value, length) {
            return (value.toString().length < length) ? AEpisodic.pad("0" + value, length) : value;
        }

        pad(value, length) {
            return AEpisodic.pad(value, length);
        }

        static attributes() {
            return ["episodes", "lastEpisode", "showAll"];
        }
    };
});