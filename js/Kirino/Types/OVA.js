//namespace Kirino/Types
define(function (require) {
    var md5 = require("lib/md5");
    var TYPE = "ova-";
    return class OVA extends require("Base/Synchronized") {
        constructor(name) {
            super();
            this.name = name;
            this.anidbEpisodeId = null;
            this.date = null;
            this._searchText = null;

            this.lastDateRefreh = 0;
            this.lastSearchRefreh = 0;
        }

        get searchText() {
            return this._searchText;
        }
        set searchText(searchText) {
            this._searchText = true ? searchText : null;
        }

        get id() {
            var id = this.anidbEpisodeId ? this.anidbEpisodeId : this.name;
            return TYPE + md5(id);
        }
        get dataHash() {
            return (this.anidbEpisodeId !== null ? md5(this.name) : "") + md5(this.searchText) + md5(this.date);
        }
    };
});