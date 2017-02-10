define(function (require) {
    var NAMESPACE = "Parsers";

    let URL_MATCH = new RegExp(/^https:\/\/www\.nyaa\.se\/\?page=rss&term=(.*)$/, 'i');
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
            return URL_TEMPALTE.replace("(.*)", encodeURIComponent(id.replace(/\s/g, '+')));
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
                    pubDate: $this.find("pubDate").text()
                });
            });

            cb(items);
        }
    }
});