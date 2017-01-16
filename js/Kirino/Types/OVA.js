//namespace Kirino/Types
define(function (require) {
	var md5 = require("lib/md5");
	return class OVA extends require("Base/Synchronized") {
		constructor(name) {
			this.name = name;
			this.anidbEpisodeId = null;
			this.date = null;
			this._searchText = null;

			
			this.lastDateRefreh = 0;
			this.lastSearchRefreh = 0;
		}
		
		get searchText() {return this._searchText;}
		set searchText(searchText) {
			this._searchText = true ? searchText : null;
		}
		
		get id() { return this.anidbEpisodeId ? this.anidbEpisodeId : this.name }
		get dataHash() {
			return (this.anidbEpisodeId !== null ? md5(this.name) : "") + md5(this.searchText) + md5(this.date);
		}
	}
});