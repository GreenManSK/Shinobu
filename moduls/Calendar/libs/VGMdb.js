var urlModule = require('url');
var cheerio = require('cheerio');
var util = require("util");
var querystring = require('querystring');
var moment = require('moment');

function VGMdb(config, context) {
    if (!(this instanceof VGMdb))
        return new VGMdb(config, context);
    this.config = config;
    this.context = context;
}

VGMdb.prototype.url = 'vgmdb.net';
VGMdb.prototype.searchUrl = '/search?do=results';
VGMdb.prototype.albumUrl = '/album/%d';
VGMdb.prototype.searchPost = {
    action: 'advancedsearch',
    albumtitles: '',
    catalognum: '',
    eanupcjan: '',
    dosearch: 'Search Albums Now',
    'pubtype[0]': 1,
    'distype[0]': 1,
    'category[1]': 0,
    'category[2]': 0,
    'category[4]': 0,
    'category[8]': 0,
    'category[16]': 0,
    composer: '',
    arranger: '',
    performer: '',
    lyricist: '',
    publisher: '',
    trackname: '',
    caption: '',
    notes: '',
    anyfield: '',
    'classification[1]': 0,
    'classification[2]': 0,
    'classification[32]': 0,
    'classification[4]': 0,
    'classification[16]': 0,
    'classification[256]': 0,
    'classification[512]': 0,
    'classification[64]': 0,
    'classification[4096]': 0,
    'classification[8]': 0,
    'classification[128]': 0,
    'classification[1024]': 0,
    'classification[2048]': 0,
    releasedatemodifier: 'newer',
    discsmodifier: 'is',
    discs: '',
    pricemodifier: 'is',
    price_value: '',
    tracklistmodifier: 'is',
    tracklists: '',
    scanmodifier: 'is',
    scans: '',
    albumadded: '',
    albumlastedit: '',
    scanupload: '',
    tracklistadded: '',
    tracklistlastedit: '',
    sortby: 'albumtitle',
    orderby: 'ASC',
    childmodifier: 0,
    /* For modification */
    day: 1,
    month: 7,
    year: 2015,
    game: 'gintama'
};

VGMdb.prototype.search = function (name, day, month, year, cb) {
    var self = this;
    this.searchRequest(name, day, month, year, function (err, source) {
        if (err) {
            cb(err);
        } else {
            cb(false, self.parseSearch(source));
        }
    });
};

VGMdb.prototype.album = function (id, cb) {
    var self = this;
    this.albumRequest(id, function (err, source) {
        if (err) {
            cb(err);
        } else {
            cb(false, self.parseAlbum(source));
        }
    });
};

VGMdb.prototype.parseAlbum = function (source) {
    var $ = cheerio.load(source);
    var data = {date: null};

    $('#album_infobit_large').find('a').each(function (i, elem) {
        var d = new Date($(this).text());
        if (d.toString() !== 'Invalid Date')
            data.date = d;
    });

    data.title = $('.albumtitle').first().text();

    return data;
};

VGMdb.prototype.parseSearch = function (source) {
    var results = [];
    var $ = cheerio.load(source);
    $($('table').get(4)).find('tr').each(function (i, elem) {
        var $this = $(this);
        var td = {
            name: $this.find('.albumtitle[lang=en]').text(),
            url: $this.find('a').attr('href'),
            date: new Date($($this.find('td').get(3)).text())
        };
        td.id = td.url ? td.url.replace('http://vgmdb.net/album/', '') : null;
        td.dateFormated = moment(td.date).format('DD.MM.YYYY');
        if (td.name)
            results.push(td);
    });

    return results;
};

VGMdb.prototype.searchRequest = function (name, day, month, year, cb) {
    var http = require('http');

    var postData = util._extend({}, this.searchPost);
    postData.game = name;
    postData.day = day;
    postData.month = month;
    postData.year = year;
    postData = querystring.stringify(postData);

    var options = {
        host: this.url,
        path: this.searchUrl,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    };

    var req = http.request(options, function (res) {
        var source = '';

        res.on('data', function (chunk) {
            source += chunk;
        });

        res.on('end', function () {
            cb(false, source);
        });
    });

    req.on('error', function (err) {
        cb(404);
    });

    req.write(postData);
    req.end();
};

VGMdb.prototype.albumRequest = function (id, cb) {
    var http = require('http');

    var req = http.request({
        host: this.url,
        path: this.albumUrl.replace(/%d/g, id)
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

// Functions which will be available to external callers
module.exports = VGMdb;