var _AbstractModel = require('./_AbstractModel.js'),
        util = require('util');

function AnimeModel(config, context) {
    if (!(this instanceof AnimeModel)) {
        return new AnimeModel(config, context);
    }
    this.fileName = 'anime';
    this.useSubdates = true;
    AnimeModel.super_.apply(this, arguments);
}
util.inherits(AnimeModel, _AbstractModel);

AnimeModel.prototype.add = function (name, aid, nyaa, notifyDate, notifyFile, cb) {
    _AbstractModel.prototype.add.call(this, {
        name: name,
        aid: aid,
        nyaa: nyaa,
        notifyDate: notifyDate,
        notifyFile: notifyFile
    }, cb);
};

AnimeModel.prototype.edit = function (id, name, aid, nyaa, notifyDate, notifyFile, cb) {
    _AbstractModel.prototype.edit.call(this, id, {
        name: name,
        aid: aid,
        nyaa: nyaa,
        notifyDate: notifyDate,
        notifyFile: notifyFile
    }, cb);
};

AnimeModel.prototype.getItemData = function (o, cb) {
    if (o.aid && o.dates.length < 2) {
        var maxDate = new Date();
        if (o.dates.length && o.dates.length > 0) {
            var now = maxDate;
            for (var i in o.dates) {
                var d = new Date(o.dates[i]);
                if (now < d) {
                    maxDate = d;
                }
            }
        }

        this.context.getService('aniDb').getAnimeData(o.aid, function (err, data) {
            if (err) {
                cb(err);
            } else {
                for (var i in data.episodes) {
                    if (data.episodes[i].airdate > maxDate) {
                        o.dates.push(data.episodes[i].airdate);
                        if (o.dates.length >= 2)
                            break;
                    }
                }
                cb(false, o);
            }
        });
    } else {
        cb(false, o);
    }
};

AnimeModel.prototype.watch = function (id, date, cb) {
    id = parseInt(id);
    date = new Date(date);

    for (var i in this.data) {
        if (this.data[i].id === id) {
            for (var j in this.data[i].dates) {
                if (new Date(this.data[i].dates[j]).toDateString() === date.toDateString()) {
                    var p = this.data[i].dates.indexOf(this.data[i].dates[j]);
                    if (p !== -1) {
                        this.data[i].dates.splice(p, 1);
                    }

                    if (this.data[i].dates.length === 0) {
                        this.edit(id, this.data[i].name, this.data[i].link, this.data[i].notify, cb);
                    } else {
                        cb(false);
                    }

                    return;
                }
            }
            return;
        }
    }
};

module.exports = AnimeModel;