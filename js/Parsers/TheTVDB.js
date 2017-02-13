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
                let airdate = $ep.find("td:nth-child(3)").text().trim();
                let name = $ep.find("td:nth-child(1)").text().trim();
                let split = name.split("x");
                if (split.length > 1) {
                    show.episodes.push({
                        season: parseInt(split[0]),
                        episode: parseInt(split[1]),
                        date: airdate ? new Date(airdate) : null
                    });
                }
            }

            function compare(a, b) {
                if (a.number < b.number)
                    return -1;
                if (a.number > b.number)
                    return 1;
                return 0;
            }

            show.episodes.sort(compare);

            cb(show);
        }

        static getForm() {
            return "Form/Entity/show";
        }
    }
});