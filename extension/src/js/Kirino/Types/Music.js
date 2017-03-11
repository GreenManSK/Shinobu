define(function (require) {
    var NAMESPACE = "Kirino/Types";
    var Synchronized = require("Base/Synchronized");

    class Music extends Synchronized {
        static create(show,
                      type,
                      title = null,
                      author = null,
                      date = null,
                      anisonId = null,
                      anidbId = null,
                      searchText = null,
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
                            notified: notified
                        }
                    ).then(() => {
                        return obj;
                    });
                }
            );
        }

        static attributes() {
            return ["show", "type", "title", "author", "date", "anisonId", "anidbId", "searchText", "notified"];
        }
    }

    Synchronized._registerClass(Music);

    return Music;
});