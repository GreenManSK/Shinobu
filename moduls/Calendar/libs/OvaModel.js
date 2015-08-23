var fs = require('fs');
var util = require("util");
var moment = require('moment');

var OvaModel = function (config, context) {
    if (!(this instanceof OvaModel))
        return new OvaModel(config, context);

    this.config = config;
    this.context = context;

    this.ova = [];

    this.load();

    this.context.getService("saver").add([this, this.save]);
};

OvaModel.prototype.save = function () {
    fs.writeFileSync("./" + this.config.get('dataDir') + "/ova.json", JSON.stringify(this.ova, null, '    '));
};

OvaModel.prototype.load = function () {
    var content = '[]';

    if (fs.existsSync("./" + this.config.get('dataDir') + "/ova.json"))
        content = fs.readFileSync("./" + this.config.get('dataDir') + "/ova.json").toString();

    this.ova = JSON.parse(content);
};

OvaModel.prototype.getNextId = function () {
    var id = 0;
    for (var i in this.ova) {
        if (this.ova[i].id > id)
            id = this.ova[i].id;
    }
    return id + 1;
};

OvaModel.prototype.getAll = function () {
    var ova = [];

    var now = new Date();
    for (var i in this.ova) {
        var m = util._extend({}, this.ova[i]);

        m.nyaaUrl = this.nyaaEncode(m.nyaa);
        m.released = m.date && now >= new Date(m.date);
        m.dateForm = m.date ? moment(m.date).format('YYYY-MM-DD') : '';
        m.date = m.date ? moment(m.date).format('DD.MM.YYYY') : '';
        ova.push(m);
    }

    function compare(a, b) {
        if (a.date < b.date)
            return 1;
        if (a.date > b.date)
            return -1;
        return 0;
    }

    return ova.sort(compare);
};

OvaModel.prototype.get = function (id) {
    id = parseInt(id);

    for (var i in this.ova) {
        if (this.ova[i].id === id) {
            return this.ova[i];
        }
    }
};

OvaModel.prototype.nyaaEncode = function (str) {
    return encodeURIComponent(str).replace(/%20/, '+');
};

OvaModel.prototype.add = function (name, aid, eid, nyaa, date, notifyDate, notifyFile, cb) {
    var o = {
        id: this.getNextId(),
        name: name,
        aid: aid,
        eid: eid,
        nyaa: nyaa,
        date: date,
        notifyDate: notifyDate,
        notifyFile: notifyFile
    };

    if (aid && eid) {
        var self = this;
        this.context.getService('aniDb').getAnimeData(aid, function (err, data) {
            if (err) {
                cb(err);
            } else {
                for (var i in data.episodes) {
                    if (data.episodes[i].id == eid) {
                        o.date = data.episodes[i].airdate;
                        break;
                    }
                }

                self.ova.push(o);
                cb(false);
            }
        });
    } else {
        this.ova.push(o);
        cb(false);
    }
};

OvaModel.prototype.edit = function (id, name, aid, eid, nyaa, date, notifyDate, notifyFile, cb) {
    var o = this.get(id);

    o.name = name;
    o.aid = aid;
    o.eid = eid;
    o.nyaa = nyaa;
    o.date = date;
    o.notifyDate = notifyDate;
    o.notifyFile = notifyFile;

    if (aid && eid) {
        this.context.getService('aniDb').getAnimeData(aid, function (err, data) {
            if (err) {
                cb(err);
            } else {
                for (var i in data.episodes) {
                    if (data.episodes[i].id == eid) {
                        o.date = data.episodes[i].airdate;
                        break;
                    }
                }
                cb(false);
            }
        });
    } else {
        cb(false);
    }
};

OvaModel.prototype.delete = function (id) {
    id = parseInt(id);
    for (var i in this.ova) {
        if (this.ova[i].id === id) {
            delete this.ova[i];
            this.ova.length = this.ova.length - 1;
            return;
        }
    }
};

OvaModel.prototype.dataRefresh = function (cb) {
    var need = [];
    for (var i in this.ova) {
        var o = this.ova[i];
        if (o.aid && o.eid) {
            need.push(o);
        }
    }

    var c = 0;
    for (var i in need) {
        var ova = need[i];
        if (ova.aid && ova.eid) {
            this.context.getService('aniDb').getAnimeData(ova.aid, function (err, data) {
                var ova = this;
                if (err) {
                    cb(err);
                } else {
                    for (var i in data.episodes) {
                        if (data.episodes[i].id == ova.eid) {
                            ova.date = data.episodes[i].airdate;
                            break;
                        }
                    }
                    c += 1;
                    if (c === need.length) {
                        cb(false);
                    }
                }
            }.bind(ova));
        }
    }

    if (need.length === 0)
        cb(false);
};

module.exports = OvaModel;