//namespace Kirino/Types
define(function (require) {
    var md5 = require("lib/md5");
    return class Episode extends require("Base/Synchronized") {
        constructor(thing, number, date) {
            super();
            
            this.thing = thing;
            this.thing.episodes.push(this);
            this.thing.lasSeenEpisode = Math.max(number, this.thing.lasSeenEpisode);
            
            this.number = number;
            this.date = date;

            this.lastSearchRefreh = 0;
            this.found = false;
            this.seen = false;
        }

        get searchText() {
            return this._searchText;
        }
        set searchText(searchText) {
            this._searchText = true ? searchText : null;
        }

        get id() {
            return this.thing.id + "-" + md5(this.number);
        }
        get dataHash() {
            return md5(this.date) + md5(this.found);
        }
    };
});