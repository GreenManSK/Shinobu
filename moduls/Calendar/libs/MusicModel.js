var fs = require('fs');
var util = require("util");
var moment = require('moment');

var MusicModel = function (config, context) {
    if (!(this instanceof MusicModel))
        return new MusicModel(config, context);

    this.config = config;
    this.context = context;

    this.music = [];

    this.load();

    this.context.getService("saver").add([this, this.save]);
};

MusicModel.prototype.save = function () {
    fs.writeFileSync("./" + this.config.get('dataDir') + "/music.json", JSON.stringify(this.music, null, '    '));
};

MusicModel.prototype.load = function () {
    var content = '[]';

    if (fs.existsSync("./" + this.config.get('dataDir') + "/music.json"))
        content = fs.readFileSync("./" + this.config.get('dataDir') + "/music.json").toString();

    this.music = JSON.parse(content);
};

MusicModel.prototype.getAll = function () {
    var music = [];

    var now = new Date();
    for (var i in this.music) {
        var m = util._extend({}, this.music[i]);

        m.released = m.date && now >= new Date(m.date);
        m.dateForm = m.date ? moment(m.date).format('YYYY-MM-DD') : '';
        m.date = m.date ? moment(m.date).format('DD.MM.YYYY') : '';
        music.push(m);
    }

    function compare(a, b) {
        if (a.date < b.date)
            return 1;
        if (a.date > b.date)
            return -1;
        return 0;
    }

    return music.sort(compare);
};

MusicModel.prototype.get = function (id) {
    id = parseInt(id);

    for (var i in this.music) {
        if (this.music[i].id === id) {
            return this.music[i];
        }
    }
};

MusicModel.prototype.delete = function (id) {
    id = parseInt(id);
    for (var i in this.music) {
        if (this.music[i].id === id) {
            delete this.music[i];
            this.music.length = this.music.length - 1;
            return;
        }
    }
};

MusicModel.prototype.getNextId = function () {
    var id = 0;
    for (var i in this.music) {
        if (this.music[i].id > id)
            id = this.music[i].id;
    }
    return id + 1;
};

MusicModel.prototype.add = function (name, id, date, notify, cb) {
    var m = {
        id: this.getNextId(),
        name: name,
        vgmid: id,
        date: date,
        notify: notify,
        title: null
    };

    if (id) {
        var self = this;
        this.context.getService('vgmDb').album(id, function (err, album) {
            if (err) {
                cb(err);
            } else {
                m.title = album.title;
                m.date = album.date;
                self.music.push(m);
                cb(false);
            }
        });
    } else {
        this.music.push(m);
        cb(false);
    }
};

MusicModel.prototype.edit = function (id, name, vgmid, date, notify, cb) {
    var m = this.get(id);
    if (!m) {
        cb(true);
        return;
    }

    m.name = name;
    m.vgmid = vgmid;
    m.date = date;
    m.notify = notify;

    if (vgmid) {
        this.context.getService('vgmDb').album(vgmid, function (err, album) {
            if (err) {
                cb(err);
            } else {
                m.title = album.title;
                m.date = album.date;
                cb(false);
            }
        });
    } else {
        cb(false);
    }
};

MusicModel.prototype.dataRefresh = function (cb) {
    var need = [];
    for (var i in this.music) {
        var m = this.music[i];
        if (m.vgmid) {
            need.push(m);
        }
    }

    var c = 0;
    for (var i in need) {
        this.context.getService('vgmDb').album(need[i].vgmid, function (err, album) {
            var m = this;
            m.title = album.title;
            m.date = album.date;
            c += 1;

            if (c === need.length) {
                cb(false);
            }
        }.bind(need[i]));
    }
    
    if (need.length === 0)
        cb(false);
};

module.exports = MusicModel;
