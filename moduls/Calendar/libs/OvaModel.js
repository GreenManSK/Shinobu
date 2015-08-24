var _AbstractModel = require('./_AbstractModel.js'),
        util = require('util');

function OvaModel(config, context) {
    if (!(this instanceof OvaModel)) {
        return new OvaModel(config, context);
    }
    this.fileName = 'ova';
    OvaModel.super_.apply(this, arguments);
}
util.inherits(OvaModel, _AbstractModel);

OvaModel.prototype.getAll = function () {
    var self = this;
    return _AbstractModel.prototype.getAll.call(this, function (o) {
        o.nyaaUrl = self.nyaaEncode(o.nyaa);
        return o;
    });
};

OvaModel.prototype.nyaaEncode = function (str) {
    return encodeURIComponent(str).replace(/%20/, '+');
};

OvaModel.prototype.add = function (name, aid, eid, nyaa, date, notifyDate, notifyFile, cb) {
    _AbstractModel.prototype.add.call(this, {
        name: name,
        aid: aid,
        eid: eid,
        nyaa: nyaa,
        date: date,
        notifyDate: notifyDate,
        notifyFile: notifyFile
    }, cb);
};

OvaModel.prototype.edit = function (id, name, aid, eid, nyaa, date, notifyDate, notifyFile, cb) {
    _AbstractModel.prototype.edit.call(this, id, {
        name: name,
        aid: aid,
        eid: eid,
        nyaa: nyaa,
        date: date,
        notifyDate: notifyDate,
        notifyFile: notifyFile
    }, cb);
};

OvaModel.prototype.getItemData = function (o, cb) {
    if (o.aid && o.eid) {
        this.context.getService('aniDb').getAnimeData(o.aid, function (err, data) {
            if (err) {
                cb(err);
            } else {
                for (var i in data.episodes) {
                    if (data.episodes[i].id == o.eid) {
                        o.date = data.episodes[i].airdate;
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

module.exports = OvaModel;