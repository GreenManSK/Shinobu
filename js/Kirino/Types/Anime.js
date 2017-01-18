//namespace Kirino/Types
define(function (require) {
    var md5 = require("lib/md5");
    var TYPE = "anime-";
    return class Anime extends require("Kirino/Types/AEpisodic") {
        constructor(anidbId, name) {
            super();
            this.anidbId = anidbId;
            this.name = name;
            this._searchText = null;

            this.lastEpisodeRefreh = 0;
            this.lastSearchRefreh = 0;
        }
        
        decodeEpisodNumber(number) {
            return number;
        }

        get searchText() {
            return this._searchText;
        }
        set searchText(searchText) {
            this._searchText = true ? searchText : null;
        }

        get id() {
            return TYPE + md5(this.anidbId);
        }
        get dataHash() {
            return md5(this.name) + md5(this.searchText) + md5(this.lastEpisode);
        }
    };
});