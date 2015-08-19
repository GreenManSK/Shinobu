var urlModule = require('url');
var cheerio = require('cheerio');
var fs = require('fs');
var http = require('http');
var gunzip = require('zlib').createGunzip();

function AniDB(config, context) {
    if (!(this instanceof AniDB))
        return new AniDB(config, context);
    this.config = config;
    this.context = context;

    this.configured = true;
    this.httpClient = null;
    this.animes = [];

    this.checkConfig();

    this.loadAnimes();
}

AniDB.prototype.version = 1;

AniDB.prototype.animetitlesLink = 'http://localhost/animetitles.xml.gz';//'http://anidb.net/api/animetitles.xml.gz';

AniDB.prototype.httpApi = 'http://api.anidb.net:9001/httpapi?request=anime&client=%httpClient&clientver=%clientver&protover=1&aid=%aid';

AniDB.prototype.checkConfig = function () {
    this.httpClient = this.config.get('httpClient', false);
    if (!this.httpClient) {
        this.configured = false;
        console.log('You need to properly configure Calendar\'s AniDB.');
        console.log('You need to set httpClient.');
    }
};

AniDB.prototype.loadAnimes = function () {
    var content = '[]';

    if (fs.existsSync("./" + this.config.get('dataDir') + "/../animes.json")) {
        content = fs.readFileSync("./" + this.config.get('dataDir') + "/../animes.json").toString();
    }

    this.animes = JSON.parse(content);
};
AniDB.prototype.saveAnimes = function () {
    fs.writeFileSync("./" + this.config.get('dataDir') + "/../animes.json", JSON.stringify(this.animes));
};

/* For God's sake, use this only onec a day! */
AniDB.prototype.parseTitles = function (cb) {
    if (!this.configured) {
        cb('You need to properly configure Calendar\'s AniDB.');
        return;
    }

    var self = this;
    console.log('Parsing AniDB titles');
    var req = http.request(urlModule.parse(this.animetitlesLink), function (respons) {
        var data = '';

        respons.on('data', function (chunk) {
            data += chunk;
        });

        respons.on('end', function () {
            data = data.split('\n');
            var animes = [];
            for (var i = 2; i < data.length; i++) {
                var line = data[i].trim();

                if (line === '</animetitles>')
                    break;

                var anime = {
                    id: null,
                    titles: []
                };

                anime.id = line.match(/aid="(.*)"/)[1];
                var en = '', jp = '';
                do {
                    line = data[++i].trim();

                    if (en === '') {
                        var m = line.match(/type="official" xml:lang="en"/);
                        if (m !== null) {
                            en = line.match(/>(.*)</)[1];
                        }
                    }

                    if (jp === '') {
                        var m = line.match(/type="main"/);
                        if (m !== null) {
                            jp = line.match(/>(.*)</)[1];
                        }
                    }
                } while (line !== '</anime>')
                anime.titles.push(en);
                anime.titles.push(jp);

                animes.push(anime);
            }

            self.animes = animes;
            self.saveAnimes();
            cb(true);
        });
    });

    req.on('error', function (err) {
        console.log('Coudln\'t parse AniDB titles');
        cb(true);
    });

    req.end();
};

AniDB.prototype.search = function (name) {
    var regEx = new RegExp(name, 'ig');
    var result = [];

    for (var i in this.animes) {
        for (var j in this.animes[i].titles) {
            if (this.animes[i].titles[j].match(regEx) !== null) {
                result.push(this.animes[i]);
                break;
            }
        }
    }

    return result.reverse();
};

AniDB.prototype.getAnimeData = function (aid, cb) {
    var self = this;

    var req = http.request(
            urlModule.parse(this.httpApi
                    .replace(/%httpClient/g, this.httpClient)
                    .replace(/%clientver/g, this.version)
                    .replace(/%aid/g, parseInt(aid))),
            function (res) {
                var output, data = '';

                if (res.headers['content-encoding'] === 'gzip') {
                    res.pipe(gunzip);
                    output = gunzip;
                } else {
                    output = res;
                }

                output.on('data', function (chunk) {
                    data += chunk.toString('utf-8');
                });

                output.on('end', function () {
                    data = data.split('\n');
                    var parsedData = {
                        aid: aid,
                        start: null,
                        end: null,
                        title: null,
                        episodes: []
                    };

                    for (var i in data) {
                        var line = data[i].trim();

                        if (parsedData.start === null && line.match(/^<startdate/i) !== null) {
                            parsedData.start = new Date(line.match(/>(.*?)</)[1]);
                        } else if (parsedData.end === null && line.match(/^<enddate/i) !== null) {
                            parsedData.end = new Date(line.match(/>(.*?)</)[1]);
                        } else if (parsedData.title === null && line.match(/^<title(.*)type="main"/i) !== null) {
                            parsedData.title = line.match(/>(.*?)</)[1];
                        } else if (line.match(/^<episode(?!count|s)/i) !== null) {
                            var ep = {
                                id: null,
                                airdate: null,
                                epno: null,
                                title: [null, null] //en, jp
                            };

                            ep.id = parseInt(line.match(/id="(.*?)"/i)[1]);

                            do {
                                line = data[++i].trim();

                                if (ep.airdate === null && line.match(/^<airdate/i) !== null) {
                                    ep.airdate = new Date(line.match(/>(.*?)</)[1]);
                                } else if (ep.epno === null && line.match(/^<epno/i) !== null) {
                                    ep.epno = line.match(/>(.*?)</)[1];
                                } else if (ep.title[0] === null && line.match(/^<title xml:lang="en">/i) !== null) {
                                    ep.title[0] = line.match(/>(.*?)</)[1];
                                } else if (ep.title[1] === null && line.match(/^<title xml:lang="x-jat">/i) !== null) {
                                    ep.title[1] = line.match(/>(.*?)</)[1];
                                }
                            } while (line !== '</episode>');

                            parsedData.episodes.push(ep);
                        }
                    }
                    cb(false, parsedData);
                });
            });
    req.on('error', function (err) {
        cb(true);
    });

    req.end();
};

module.exports = AniDB;