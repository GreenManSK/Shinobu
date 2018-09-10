define(function (require) {
    var NAMESPACE = "Parsers";

    //let URL_MATCH = new RegExp(/^https:\/\/www\.nyaa\.se\/\?page=rss&term=(.*)$/, 'i');
    let URL_MATCH = new RegExp(/^https:\/\/nyaa\.si\/\?page=rss&c=0_0&f=0&q=(.*)$/, 'i');
    let URL_TEMPALTE = URL_MATCH.toString().replace(/(\/\^|\$|\/i|\\|s\?)/g, "");

    return class Nyaaeu extends require("Parsers/BaseParser") {
        static doesUrlMatch(url) {
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
            //return "https://www.nyaa.se/?page=search&cats=0_0&filter=0&term=" + encodeURIComponent(search).replace(/%20/g, '+');
            return "https://nyaa.si/?f=0&c=0_0&q=" + encodeURIComponent(search).replace(/%20/g, '+');
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