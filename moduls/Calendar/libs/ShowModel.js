var _AbstractModel = require('./_AbstractModel.js'),
        util = require('util');

function ShowModel(config, context) {
    if (!(this instanceof ShowModel)) {
        return new ShowModel(config, context);
    }
    this.fileName = 'shows';
    this.useSubdates = true;
    ShowModel.super_.apply(this, arguments);
}
util.inherits(ShowModel, _AbstractModel);

ShowModel.prototype.add = function (name, link, notify, cb) {
    _AbstractModel.prototype.add.call(this, {
        name: name,
        link: link,
        notify: notify
    }, cb);
};

ShowModel.prototype.edit = function (id, name, link, notify, cb) {
    _AbstractModel.prototype.edit.call(this, id, {
        name: name,
        link: link,
        notify: notify
    }, cb);
};

ShowModel.prototype.getItemData = function (o, cb) {
    if (o.link) {
        var maxDate = null;
        if (o.dates.length && o.dates.length > 0) {
            var now = new Date();
            for (var i in o.dates) {
                var d = new Date(o.dates[i]);
                if (now < d) {
                    maxDate = d;
                }
            }
        }

        var self = this;
        this.context.getService('nextEpisode').getNext(o.link, function (err, date) {
            if (err) {
                cb(err);
            } else {
                if (date && (maxDate === null || date > maxDate))
                    o.dates.push(date);
                cb(false, o);
            }
        });
    } else {
        cb(false, o);
    }
};

ShowModel.prototype.watch = function (id, date, cb) {
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

module.exports = ShowModel;