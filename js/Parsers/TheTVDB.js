define(function (require) {
    var NAMESPACE = "Parsers";

    let URL_MATCH = new RegExp(/^https?:\/\/www\.thetvdb\.com\/\?tab=seasonall&id=(\d+)/, 'i');
    let URL_TEMPALTE = URL_MATCH.toString().replace(/(\/\^|\/i|\\|s\?)/g, "");

    return class TheTVDB extends require("Parsers/BaseParser") {
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
            let show = {
                name: null,
                episodes: [],
                thetvdbId: this.getIdFromUrl(evt.target.responseURL)
            };

            var $response = $(response);

            show.name = $response.find("h1").text();

            let episodes = $response.find("#listtable tbody tr").toArray();
            for (let i in episodes) {
                let $ep = $(episodes[i]);
                let airdate = $ep.find(".odd:nth-child(3)").text().trim();
                show.episodes[$ep.find(".odd:nth-child(1)").text().trim()] = airdate ? new Date(airdate) : null;
            }

            cb(show);
        }

        static getForm() {
            return "Form/Entity/show";
        }
    }
});