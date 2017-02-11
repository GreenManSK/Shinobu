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
                      lastSearchRefresh = null,
                      notified = false) {
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
                            lastSearchRefresh: lastSearchRefresh,
                            notified: notified
                        }
                    ).then(() => {
                        return obj;
                    });
                }
            );
        }

        static attributes() {
            return ["show", "type", "title", "author", "date", "anisonId", "anidbId", "searchText", "lastDateRefresh", "lastSearchRefresh", "notified"];
        }
    };
});