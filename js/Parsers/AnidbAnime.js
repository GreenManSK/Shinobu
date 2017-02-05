define(function (require) {
    var NAMESPACE = "Parsers";

    let URL_MATCH = new RegExp(/^https?:\/\/anidb\.net\/perl-bin\/animedb\.pl\?show=anime&aid=(\d+)/, 'i');
    let URL_TEMPALTE = URL_MATCH.toString().replace(/(\/\^|\/i|\\|s\?)/g, "");

    let HTTP_API = 'http://api.anidb.net:9001/httpapi?request=anime&client=%httpClient&clientver=%clientver&protover=1&aid=%aid';
    let CLIENTVER = 2;
    let HTTP_CLIENT = 'shinobu';
    let API_URL = HTTP_API
        .replace(/%httpClient/g, HTTP_CLIENT)
        .replace(/%clientver/g, CLIENTVER);

    return class AnidbAnime extends require("Parsers/BaseParser") {
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

        static _getDataUrl(id) {
            return API_URL.replace(/%aid/g, id);
        }

        static _onLoad(cb, evt, response) {
            let anime = {
                anidbId: null,
                name: null,
                episodes: []
            };

            var $response = $(response);
            anime.anidbId = $response.get(1).id;
            anime.name = $response.find("title[type=main]").text();
            console.log(anime);

            let episodes = $response.find("episode").toArray();
            for (let i in episodes) {
                let $ep = $(episodes[i]);
                let airdate = $ep.find("airdate").text();
                anime.episodes[$ep.find("epno[type=1]").text()] = airdate ? new Date(airdate) : null;
            }

            cb(anime);
        }

        static getForm() {
            return "Form/Entity/anime";
        }
    }
});