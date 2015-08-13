var urlModule = require('url');
var cheerio = require('cheerio');
var validUrl = require('valid-url');

function SiteParser(config, context) {
    if (!(this instanceof SiteParser))
        return new SiteParser(config, context);

    this.config = config;
    this.context = context;
}

SiteParser.prototype.parse = function (url, cb) {
    var self = this;
    this.getSource(url, function (error, source) {
        if (error) {
            cb(error);
            return;
        }

        self.parseSource(source, function (error, data) {
            if (error) {
                cb(error);
                return;
            }
            url = urlModule.parse(url);
            url = url.protocol + '//' + url.host + '/';

            if (data.icon.match(/^https?:\/\//) === null && data.icon !== "") {
                data.icon = url + data.icon;
            }

            cb(false, data);
        });
    });
};

SiteParser.prototype.getSource = function (url, cb) {
    var http = null;

    switch (this._getUrlType(url)) {
        case 'http':
            http = require('http');
            break;
        case 'https':
            http = require('https');
            break;
        default:
            cb(400);
            return;
    }

    var options = urlModule.parse(url), req = http.request(options, function (response) {
        var source = '';

        response.on('data', function (chunk) {
            source += chunk;
        });

        response.on('end', function () {
            cb(false, source);
        });
    });

    req.on('error', function () {
        cb(400);
    });

    req.end();
};

SiteParser.prototype.parseSource = function (source, cb) {
    var $ = cheerio.load(source), title = $('title').text(), icon = this._getIconUrl($);

    cb(false, {
        title: title,
        icon: icon
    });
};

SiteParser.prototype._getUrlType = function (url) {
    if (validUrl.isHttpUri(url)) {
        return 'http';
    }
    if (validUrl.isHttpsUri(url)) {
        return 'https';
    }
    return null;
};

SiteParser.prototype._getIconUrl = function ($) {
    var icons = $('link[rel~="icon"]'), url = "";

    if (icons.length === 1) {
        url = icons.attr('href');
    } else if (icons.length > 0) {
        var biggestSize = 0;
        url = icons.attr('href');
        icons.each(function () {
            var $this = $(this), size = parseInt($this.attr('size'), 10);
            if (size > biggestSize) {
                url = $this.attr('href');
            }
        });
    }

    return url;
};

// Functions which will be available to external callers
module.exports = SiteParser;
