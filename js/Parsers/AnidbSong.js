define(function (require) {
    var NAMESPACE = "Parsers";
    let Anison = require("Parsers/Anison");

    let URL_MATCH = new RegExp(/^https?:\/\/anidb\.net\/perl-bin\/animedb\.pl\?show=song&songid=(\d+)/, 'i');
    let URL_TEMPALTE = URL_MATCH.toString().replace(/(\/\^|\/i|\\|s\?)/g, "");

    return class AnidbSong extends require("Parsers/BaseParser") {
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
                anisonId: null,
                anidbId: this.getIdFromUrl(evt.target.responseURL)
            };

            var $response = $(response);

            let $anime = $response.find('#animelist tbody tr:first-child');
            song.show = $anime.find('.name').text();
            song.type = $anime.find('td:first-child').text();

            song.title = $response.find(":contains('Main Title')").parent('tr').find('.value span').text();
            song.author = $response.find(".creators .value").text();

            let anisonUrl = $response.find('.anison').attr('href');
            if (anisonUrl)
                song.anisonId = Anison.getIdFromUrl(anisonUrl);

            cb(song);
        }

        static getForm() {
            return "Form/Entity/music";
        }
    }
});