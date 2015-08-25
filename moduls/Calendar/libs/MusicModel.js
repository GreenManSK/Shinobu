var _AbstractModel = require('./_AbstractModel.js'),
        util = require('util');

function MusicModel(config, context) {
    if (!(this instanceof MusicModel)) {
        return new MusicModel(config, context);
    }
    this.fileName = 'music';
    MusicModel.super_.apply(this, arguments);
}
util.inherits(MusicModel, _AbstractModel);

MusicModel.prototype.add = function (name, id, date, notify, cb) {
    _AbstractModel.prototype.add.call(this, {
        name: name,
        vgmid: id,
        date: date,
        notify: notify,
        title: null
    }, cb);
};

MusicModel.prototype.edit = function (id, name, vgmid, date, notify, cb) {
    _AbstractModel.prototype.edit.call(this, id, {
        name: name,
        vgmid: vgmid,
        date: date,
        notify: notify
    }, cb);
};

MusicModel.prototype.getItemData = function (o, cb) {
    var self = this;

    if (o.vgmid) {
        this.context.getService('vgmDb').album(o.vgmid, function (err, album) {
            if (err) {
                cb(err);
            } else {
                o.title = album.title;
                o.date = album.date;
                cb(false, o);
            }
        });
    } else {
        cb(false, o);
    }
};

module.exports = MusicModel;
