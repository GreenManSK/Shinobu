var NAMESPACE = "Kirino/Types";
define(function (require) {
    return class Music extends require("Base/Synchronized") {
        static create(show,
                      type,
                      title = null,
                      author = null,
                      date = null,
                      anisonId = null,
                      anidbId = null,
                      searchText = null,
                      lastDateRefresh = null,
                      lastSearchRefresh = null) {
            return super.create().then((obj) => {
                    return obj.set({
                            show: show,
                            type: type,
                            title: title,
                            author: author,
                            date: date,
                            anisonId: anisonId,
                            anidbId: anidbId,
                            searchText: searchText,
                            lastDateRefresh: lastDateRefresh,
                            lastSearchRefresh: lastSearchRefresh
                        }
                    ).then(() => {
                        return obj;
                    });
                }
            );
        }

        static attributes() {
            return ["show", "type", "title", "author", "date", "anisonId", "vgmdbId", "searchText", "lastDateRefresh", "lastSearchRefresh"];
        }
    };
});