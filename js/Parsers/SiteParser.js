define(function (require) {
    var NAMESPACE = "Parsers";

    return class SiteParser extends require("Parsers/BaseParser") {
        static doesUrlMatch(url) {
            return true;
        }

        static getIdFromUrl(url) {
            return url;
        }

        static getUrl(id) {
            return id;
        }

        static _onLoad(cb, evt, response) {
            console.log(evt);
            let data = {
                url: evt.target.responseURL,
                title: null,
                icon: null
            };

            let title = response.match(/<title.*?>(.*?)<\/title>/im);
            data.title = title !== null ? title[1] : '';

            data.icon = SiteParser._getIconUrl(evt, response);

            cb(data);
        }

        static _onError(cb, url) {

        }

        static _getIconUrl(evt, response) {
            var links = response.match(/(<link .*?>)/gmi);
            var url = "";

            var biggestSize = -1;
            for (var i in links) {
                var $icon = $(links[i]);
                if ($icon.is('[rel~="icon"]')) {
                    if (biggestSize === -1) {
                        url = $icon.attr('href');
                        biggestSize = parseInt($icon.attr('sizes'), 10);
                        biggestSize = isNaN(biggestSize) ? 0 : biggestSize;
                    } else {
                        var size = parseInt($icon.attr('sizes'), 10);
                        if (size > biggestSize) {
                            url = $icon.attr('href');
                        }
                    }
                }
            }

            if (url !== "" && url.match(/^https?:\/\//) === null) {
                console.log(url);
                console.log(url.match(/^\/\//));
                if (url.match(/^\/\//) !== null) {
                    url =  evt.target.responseURL.match('(https?:)')[0] + url;
                } else {
                    url = evt.target.responseURL.replace(/^([^\/]*\/\/[^\/]*).*$/, "$1") + '/' + url;
                }
            }

            return url;
        };
    }
});