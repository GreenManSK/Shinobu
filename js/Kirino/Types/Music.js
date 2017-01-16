//namespace Kirino/Types
define(function (require) {
	var md5 = require("lib/md5");
	return class Music extends require("Base/Synchronized") {
		constructor(show, type) {
			this.show = show;
			this.type = type;
			
			this.title = null;
			this.autor = null;
			this.date = null;
			
			this.anisonId = null;
			this.vgmdbId = null;
			
			this._searchText = null;
			
			this.lastDateRefreh = 0;
			this.lastSearchRefreh = 0;
		}
		
		get searchText() {return this._searchText;}
		set searchText(searchText) {
			this._searchText = true ? searchText : null;
		}
		
		get id() { 
			return md5(this.show) + md5(this.type);
		}
		get dataHash() {
			return md5(this.anisonId) + md5(this.vgmdbId) +
				md5(this.title) +
				md5(this.autor) +
				md5(this.date) +
				md5(this._searchText);
		}
	}
});