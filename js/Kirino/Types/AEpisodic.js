var NAMESPACE = "Kirino/Types";
define(function (require) {
    return class AEpisodic extends require("Base/Synchronized") {
        static create() {
            return super.create().then((obj) => {
                    return obj.set({
                            episodes: [],
                            lastEpisode: 0
                        }
                    );
                }
            );
        }

        static pad(value, length) {
            return (value.toString().length < length) ? AEpisodic.pad("0" + value, length) : value;
        }

        static attributes() {
            return ["episodes", "lastEpisode"];
        }
    };
});