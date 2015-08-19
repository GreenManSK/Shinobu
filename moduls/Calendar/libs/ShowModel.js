var fs = require('fs');
var util = require("util");
var moment = require('moment');

var ShowModel = function (config, context) {
    if (!(this instanceof ShowModel))
        return new ShowModel(config, context);

    this.config = config;
    this.context = context;

    this.shows = [];

    this.load();

    this.context.getService("saver").add([this, this.save]);
};

ShowModel.prototype.save = function () {
    fs.writeFileSync("./" + this.config.get('dataDir') + "/shows.json", JSON.stringify(this.shows, null, '    '));
};

ShowModel.prototype.load = function () {
    var content = '[]';

    if (fs.existsSync("./" + this.config.get('dataDir') + "/shows.json"))
        content = fs.readFileSync("./" + this.config.get('dataDir') + "/shows.json").toString();

    this.shows = JSON.parse(content);
};

ShowModel.prototype.getNextId = function () {
    var id = 0;
    for (var i in this.shows) {
        if (this.shows[i].id > id)
            id = this.shows[i].id;
    }
    return id + 1;
};

ShowModel.prototype.getAll = function () {
    var shows = [];

    var now = new Date();
    for (var i in this.shows) {
        if (this.shows[i].dates.length === 0) {
            var s = util._extend({}, this.shows[i]);
            s.released = false;
            s.date = '';
            shows.push(s);
        } else {
            for (var j in this.shows[i].dates) {
                var s = util._extend({}, this.shows[i]);

                s.released = now >= new Date(this.shows[i].dates[j]);
                s.dateForm = moment(this.shows[i].dates[j]).format('YYYY-MM-DD');
                s.date = moment(this.shows[i].dates[j]).format('DD.MM.YYYY');

                shows.push(s);
            }
        }
    }

    function compare(a, b) {
        if (a.date < b.date)
            return 1;
        if (a.date > b.date)
            return -1;
        return 0;
    }

    return shows.sort(compare);
};

ShowModel.prototype.get = function (id) {
    id = parseInt(id);

    for (var i in this.shows) {
        if (this.shows[i].id === id) {
            return this.shows[i];
        }
    }
};

ShowModel.prototype.add = function (name, link, notify, cb) {
    var s = {
        id: this.getNextId(),
        name: name,
        link: link,
        notify: notify,
        dates: []
    };

    var self = this;
    this.context.getService('nextEpisode').getNext(link, function (err, date) {
        if (err) {
            cb(err);
        } else {
            if (date)
                s.dates.push(date);
            self.shows.push(s);
            cb(false);
        }
    });
};

ShowModel.prototype.edit = function (id, name, link, notify, cb) {
    var s = this.get(id);
    if (!s) {
        cb(true);
        return;
    }

    s.name = name;
    s.link = link;
    s.notify = notify;

    var maxDate = '';
    var now = new Date();
    for (var i in s.dates) {
        var d = new Date(s.dates[i]);
        if (now < d) {
            maxDate = d;
        }
    }

    this.context.getService('nextEpisode').getNext(link, function (err, date) {
        if (err) {
            cb(err);
        } else {
            if (date && date > maxDate)
                s.dates.push(date);
            cb(false);
        }
    });
};

ShowModel.prototype.delete = function (id) {
    id = parseInt(id);
    for (var i in this.shows) {
        if (this.shows[i].id === id) {
            delete this.shows[i];
            this.shows.length -= 1;
            return;
        }
    }
};

ShowModel.prototype.dataRefresh = function (cb) {
    var maxDates = {};

    for (var i in this.shows) {
        maxDates[this.shows[i].id] = null;
        for (var j in this.shows[i].dates) {
            var d = new Date(this.shows[i].dates[j]);
            if (d > maxDates[this.shows[i].id]) {
                maxDates[this.shows[i].id] = d;
            }
        }
    }

    var c = 0;
    var self = this;
    for (var i in this.shows) {
        this.context.getService('nextEpisode').getNext(this.shows[i].link, function (err, date) {
            var s = this;

            if (date && date > maxDates[s.id])
                s.dates.push(date);

            c += 1;
            if (c === self.shows.length) {
                cb(false);
            }
        }.bind(this.shows[i]));
    }
};

ShowModel.prototype.watch = function (id, date, cb) {
    id = parseInt(id);
    date = new Date(date);

    for (var i in this.shows) {
        if (this.shows[i].id === id) {
            for (var j in this.shows[i].dates) {
                if (new Date(this.shows[i].dates[j]).toDateString() === date.toDateString()) {
                    delete this.shows[i].dates[j];
                    this.shows[i].dates.length -= 1;

                    if (this.shows[i].dates.length === 0) {
                        this.edit(id, this.shows[i].name, this.shows[i].link, this.shows[i].notify, cb);
                    }

                    return;
                }
            }
            return;
        }
    }
};

module.exports = ShowModel;
