define(function (require) {
    var NAMESPACE = "Background/Messages";
    let dispatcher = require("Background/Messages/Dispatcher");

    var KirinoNotify = require("Background/Loops/KirinoNotify");
    var Anison = require("Background/Loops/Anison");
    var AnidbSong = require("Background/Loops/AnidbSong");
    var AnidbEpisode = require("Background/Loops/AnidbEpisode");
    var TVDBnet = require("Background/Loops/TVDBnet");
    var AnidbAnime = require("Background/Loops/AnidbAnime");

    class KirinoDispatcher {
        constructor() {
            this.loops = {
                "notify": new KirinoNotify(),
                "anison": new Anison(),
                "anidb.song": new AnidbSong(),
                "anidb.episode": new AnidbEpisode(),
                "tvdbnet": new TVDBnet(),
                "anidb.anime": new AnidbAnime()
            };
        }

        onMessage(message, sender, sendResponse) {
            switch (message.name) {
                case "all":
                    for (let k in this.loops) {
                        this.loops[k].start(false, message.forced);
                    }
                    break;
                default:
                    if (this.loops.hasOwnProperty(message.name))
                        this.loops[message.name].start(message.ids, message.forced);
            }
        }
    }

    dispatcher.addListener("kirino", new KirinoDispatcher());
});