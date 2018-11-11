define(function (require) {
    var NAMESPACE = "Parsers";

    let URL_MATCH = new RegExp(/^https?:\/\/(?:www\.)?thetvdb\.com\/series\/([^/]+)\/seasons\/all/, 'i');
    let URL_TEMPLATE = URL_MATCH.toString().replace(/\(\?:www\\\.\)\?/g,"www.").replace(/(\/\^|\/i|\\|s\?)/g, "");

    return class TheTVDB extends require("Parsers/BaseParser") {
        static doesUrlMatch(url) {
            return url.match(URL_MATCH) !== null;
        }

        static getIdFromUrl(url) {
            var match = url.match(URL_MATCH);
            return match !== null ? match[1] : null;
        }

        static getUrl(id) {
            return URL_TEMPLATE.replace("([^/]+)", id);
        }

        static _onLoad(cb, evt, response) {
            let show = {
                name: null,
                episodes: [],
                thetvdbId: this.getIdFromUrl(evt.target.responseURL)
            };

            var $response = $(response);
            show.name = $response.find("h2 a").first().text().trim();

            let episodes = $response.find("table[id=translations] tbody tr").toArray();
            for (let i in episodes) {
                let $ep = $(episodes[i]);
                let airdate = $ep.find("td:nth-child(3)").text().trim();
                let name = $ep.find("td:nth-child(2) span").first().text().trim();
                let seasonTitle = $ep.parents('table').prev().text();
                let seasonNumber = seasonTitle.match(/(\d+)$/g);
                if (seasonNumber === null)
                    continue;
                let epNum = $ep.find("td:nth-child(1)").text().trim();
                show.episodes.push({
                    name: name,
                    season: seasonNumber.length > 0 ? seasonNumber[0] : 0,
                    episode: epNum,
                    date: airdate ? new Date(airdate) : null
                });
            }

            function compare(a, b) {
                if (a.episode < b.episode)
                    return -1;
                if (a.episode > b.episode)
                    return 1;
                return 0;
            }

            show.episodes.sort(compare);
            console.log(show);
            cb(show);
        }

        static getForm() {
            return "Form/Entity/show";
        }
    }
});