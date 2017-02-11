var NAMESPACE = "Kirino/Types";

define(function (require) {
    return class OVA extends require("Base/Synchronized") {
        static create(name,
                      anidbEpisodeId = null,
                      date = null,
                      searchText = null,
                      lastDateRefresh = 0,
                      lastSearchRefresh = 0,
                      notified =  false) {
            return super.create().then((obj) => {
                    return obj.set({
                            name: name,
                            anidbEpisodeId: anidbEpisodeId,
                            date: date,
                            searchText: searchText,
                            notified: notified
                        }
                    ).then(() => {
                        return obj;
                    });
                }
            );
        }

        static attributes() {
            return ["name", "anidbEpisodeId", "date", "searchText", "notified"];
        }
    };
});