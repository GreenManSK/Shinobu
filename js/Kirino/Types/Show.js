//namespace Kirino/Types
define(function (require) {
	var md5 = require("lib/md5");
	return class Show extends require("Base/Synchronized") {
		constructor(nextEpisodeId, name) {
			this.name = name;
			this.nextEpisodeId = nextEpisodeId;
			
			this.lasSeenEpisode = 0;
			this.lastEpisodeRefreh = 0;
		}
		
		get id() { return this.nextEpisodeId; }
		get dataHash() {
			return md5(this.nextEpisodeId) + md5(this.lasSeenEpisode);
		}
	}
});