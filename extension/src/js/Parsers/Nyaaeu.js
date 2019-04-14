define(function (require) {
    var NAMESPACE = "Parsers";
    var Synchronized = require("Base/Synchronized");

    let REGEX_END = '/\\?page=rss&c=0_0&f=0&q=(.*)$';
    var URL_MATCH = new RegExp(REGEX_END, 'i');
    let URL_TEMPALTE = URL_MATCH.toString().replace(/(\/\^|\$|\/i|\\|s\?)/g, "");


    let kirino = new Synchronized("Kirino"); //KirinoSettings.namespace
    let nyaaDomain = '';
    kirino.get({"nyaaDomain": ''}).then((kirino) => {
        nyaaDomain = kirino["nyaaDomain"];
        URL_MATCH = new RegExp('^' + nyaaDomain + REGEX_END, 'i');
    });

    return class Nyaaeu extends require("Parsers/BaseParser") {
        static doesUrlMatch(url) {
            conosle.log(nyaaDomain);
            return url.match(URL_MATCH) !== null;
        }

        static getIdFromUrl(url) {
            let match = url.match(URL_MATCH);
            return match !== null ? decodeURIComponent(match[1]).replace(/\+/g, ' ') : null;
        }

        static getUrl(id) {
            return URL_TEMPALTE.replace("(.*)", encodeURIComponent(id).replace(/%20/g, '+'));
        }
        static getSearchUrl(search) {
            return nyaaDomain + "/?f=0&c=0_0&q=" + encodeURIComponent(search).replace(/%20/g, '+');
        }

        static _onLoad(cb, evt, response) {
            let items = [];

            var $response = $(response);

            $response.find("item").each(function() {
                let $this = $(this);
                items.push({
                    title: $this.find("title").text(),
                    category: $this.find("category").text(),
                    link: $this.find("link").text(),
                    guid: $this.find("guid").text(),
                    description: $this.find("description").text(),
                    pubDate: $this.find("pubDate").text(),
                    magnet: $this.find("torrent\\:magneturi").text()
                });
            });

            cb(items);
        }
    }
});