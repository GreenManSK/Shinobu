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
    this.madeRequest(name, function (err, source) {
        if (err) {
            cb(err);
        } else {
            cb(false, self.parse(source));
        }
    });
};

NextEpisode.prototype.search = function (name, cb) {
    var self = this;
    this.madeRequest(this.searchUrl.replace(/%s/g, name), function (err, source) {
        if (err) {
            cb(err);
        } else {
            cb(false, self.parseSearch(source));
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
            cb(false, source);
        });
    });

    req.on('error', function (err) {
        cb(404);
    });

    req.end();
};

NextEpisode.prototype.parse = function (source) {
    var $ = cheerio.load(source);
    var date = $('#next_episode').text().match(/Date:(.*?)$/mi);
    if (date === null)
        return null;
    return new Date(date[1]);
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
