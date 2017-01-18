//namespace Kirino/Types
define(function (require) {
    var md5 = require("lib/md5");
    var TYPE = "show-";
    return class Show extends require("Kirino/Types/AEpisodic") {
        constructor(nextEpisodeId, name) {
            super();
            this.name = name;
            this.nextEpisodeId = nextEpisodeId;
            
            this.lastEpisodeRefreh = 0;
        }

        decodeEpisodNumber(number) {
            var text = "S" + Show.pad(Math.floor(number / 1000),2);
            text += "E" + Show.pad(number - Math.floor(number / 1000)*1000, 2);
            
            return text;
        }

        get id() {
            return TYPE + md5(this.nextEpisodeId);
        }
        get dataHash() {
            return md5(this.nextEpisodeId) + md5(this.lastEpisode);
        }
    };
});