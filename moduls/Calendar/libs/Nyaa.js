var urlModule = require('url');
var cheerio = require('cheerio');
var https = require('https');

function Nyaa(config, context) {
    if (!(this instanceof Nyaa))
        return new Nyaa(config, context);
    this.config = config;
    this.context = context;
}

Nyaa.prototype.rssUrl = 'https://www.nyaa.eu/?page=rss&term=%s';

Nyaa.prototype.encode = function (str) {
    return encodeURIComponent(str).replace(/%20/g, '+');
};

Nyaa.prototype.getItems = function (query, cb) {
    var self = this;
    var req = https.request(
            urlModule.parse(this.rssUrl
                    .replace(/%s/g, this.encode(query))),
            function (res) {
                var source = '';

                res.on('data', function (chunk) {
                    source += chunk;
                });

                res.on('end', function () {
                    cb(false, self.parse(source));
                });
            });
    req.on('error', function (err) {
        cb(true);
    });

    req.end();
};

Nyaa.prototype.parse = function (source) {
    var items = [];
    var $ = cheerio.load(source);

    $('item').each(function (i, elem) {
        var $this = $(this);
        items.push({
            title: $this.find('title').text(),
            link: $this.find('guid').text().replace('&#38;', '&')
        });
    });

    return items;
};

module.exports = Nyaa;