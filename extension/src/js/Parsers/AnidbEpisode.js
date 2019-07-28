define(function (require) {
    var NAMESPACE = "Parsers";

    let URL_MATCH = new RegExp(/^https?:\/\/anidb\.net\/episode\/(\d+)/, 'i');
    let URL_TEMPALTE = URL_MATCH.toString().replace(/(\/\^|\/i|\\|s\?)/g, "");

    return class AnidbEpisode extends require("Parsers/BaseParser") {
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
            let ova = {
                name: null,
                date: null,
                anidbEpisodeId: this.getIdFromUrl(evt.target.responseURL)
            };

            var $response = $(response);

            ova.name = $response.find("h1").text().replace("Episode: ", "");
            let date = $response.find("#tab_1_pane .date td").text().split(".");
            if (date.length === 3) {
                ova.date = new Date();
                ova.date.setDate(date[0]);
                ova.date.setMonth(date[1] - 1);
                ova.date.setYear(date[2]);
            }

            cb(ova);
        }

        static getForm() {
            return "Form/Entity/ova";
        }
    }
});