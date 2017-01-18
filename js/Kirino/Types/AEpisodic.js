//namespace Kirino/Types
define(function (require) {
    return class AEpisodic extends require("Base/Synchronized") {
        constructor(id) {
            super(id);
            this.episodes = [];
            this.lastEpisode = 0;
        }

        static pad(value, length) {
            return (value.toString().length < length) ? AEpisodic.pad("0" + value, length) : value;
        }
    };
});