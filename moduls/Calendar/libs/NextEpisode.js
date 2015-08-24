var urlModule = require('url');
var cheerio = require('cheerio');

function NextEpisode(config, context) {
    if (!(this instanceof NextEpisode))
        return new NextEpisode(config, context);

    this.config = config;
    this.context = context;
}

NextEpisode.prototype.url = 'next-episode.net';
NextEpisode.prototype.searchUrl = 'site-search-%s.html';

NextEpisode.prototype.getNext = function (name, cb) {
    var self = this;
    this.madeRequest(encodeURIComponent(name), function (err, source) {
        if (err) {
            cb(err);
        } else {
            cb(false, self.parse(source));
        }
    });
};

NextEpisode.prototype.search = function (name, cb) {
    var self = this;
    this.madeRequest(this.searchUrl.replace(/%s/g, encodeURIComponent(name)), function (err, source, location) {
        if (err) {
            cb(err);
        } else {
            if (location) {
                cb(false, location.replace(/\/$/, '').replace(/^(.*)\//, ''));
            } else {
                cb(false, self.parseSearch(source));
            }
        }
    });
};

NextEpisode.prototype.madeRequest = function (path, cb) {
    var self = this;
    var http = require('http');

    var req = http.request({
        host: this.url,
        path: '/' + path
    }, function (respons) {
        var source = '';

        respons.on('data', function (chunk) {
            source += chunk;
        });

        respons.on('end', function () {
            cb(false, source, respons.headers.location);
        });
    });

    req.on('error', function (err) {
        cb(404);
    });

    req.end();
};

NextEpisode.prototype.parse = function (source) {
    var $ = cheerio.load(source);

    var text = $('#next_episode').text();
    var date = text.match(/Date:(.*?)$/mi);
    if (date === null)
        return null;

    var season = text.match(/Season:(\d+)/);
    var number = text.match(/Episode:(\d+)/);
    var episode = '';

    if (season[1] && number[1]) {
        episode += 'S' + this.pad(season[1], 2) + 'E' + this.pad(number[1], 2);
    }

    return {
        date: new Date(date[1]),
        episode: episode
    };
};

NextEpisode.prototype.pad = function (str, max) {
    str = str.toString();
    return str.length < max ? this.pad("0" + str, max) : str;
};


NextEpisode.prototype.parseSearch = function (source) {
    var series = [];
    var $ = cheerio.load(source);
    $('.headlinehref a').each(function (i, elem) {
        var $this = $(this);
        series.push({
            name: $this.text(),
            link: $this.attr('href').replace(/^\//, ''),
            img: 'http://' + $this.find('img').attr('src')
        });
    });

    return series;
};

// Functions which will be available to external callers
module.exports = NextEpisode;
