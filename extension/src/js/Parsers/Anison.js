define(function (require) {
    var NAMESPACE = "Parsers";

    let URL_MATCH = new RegExp(/^https?:\/\/anison\.info\/data\/song\/(\d+)\.html/, 'i');
    let URL_TEMPALTE = URL_MATCH.toString().replace(/(\/\^|\/i|\\|s\?)/g, "");

    return class Anison extends require("Parsers/BaseParser") {
        static doesUrlMatch(url) {
            return url.match(URL_MATCH) !== null;
        }

        static getIdFromUrl(url) {
            let match = url.match(URL_MATCH);
            return match !== null ? match[1] : null;
        }

        static getUrl(id) {
            return URL_TEMPALTE.replace("(d+)", id);
        }

        static _onLoad(cb, evt, response) {
            let song = {
                show: null,
                type: null,
                title: null,
                author: null,
                date: null,
                anisonId: this.getIdFromUrl(evt.target.responseURL)
            };

            var $response = $(response);

            let $showInfo = $($response.find("table.list").get(1)).find("tbody tr:nth-child(1)");
            song.show = $showInfo.find("td:nth-child(2)").text();
            song.type = $showInfo.find("td:nth-child(3)").text();

            song.title = $response.find(".subject").text();
            song.author = $response.find("td:contains(歌手)").parent("tr").find("td:nth-child(2)").text();
            song.date = $response.find("[axis=date]").first().attr("title");
            if (song.date)
                song.date = new Date(song.date);

            cb(song);
        }

        static getForm() {
            return "Form/Entity/music";
        }
    }
});