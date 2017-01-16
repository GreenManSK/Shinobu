//namespace Kirino/Types
define(function (require) {
	var md5 = require("lib/md5");
	return class Anime extends require("Base/Synchronized") {
		constructor(anidbId, name) {
			this.anidbId = anidbId;
			this.name = name;
			this._searchText = null;
			
			this.lasSeenEpisode = 0;
			
			this.lastEpisodeRefreh = 0;
			this.lastSearchRefreh = 0;
		}
		
		get searchText() {return this._searchText;}
		set searchText(searchText) {
			this._searchText = true ? searchText : null;
		}
		
		get id() { return this.anidbId }
		get dataHash() {
			return md5(this.name) + md5(this.searchText) + md5(this.lasSeenEpisode);
		}
	}
});