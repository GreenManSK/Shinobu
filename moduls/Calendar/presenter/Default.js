var _AbstractPresenter = require('../../_AbstractPresenter.js'),
        util = require('util');

function Default() {
    Default.super_.apply(this, arguments);
}

util.inherits(Default, _AbstractPresenter);

Default.prototype.actionDefault = function (query, cb) {
    cb(false, {
        music: this.context.getService('musicModel').getAll(),
        shows: this.context.getService('showModel').getAll()
    });
};

/* Music */

Default.prototype.doGetAllMusic = function (query, cb) {
    cb(false, {
        music: this.context.getService('musicModel').getAll()
    });
};

Default.prototype.doGetMusic = function (query, cb) {
    cb(false, util._extend({}, this.context.getService('musicModel').get(query.id)));
};

Default.prototype.doMusicSearch = function (query, cb) {
    var d = new Date();
    this.context.getService('vgmDb').search(query.search, d.getDate(), d.getMonth() + 1, d.getFullYear(), cb);
};

Default.prototype.doAddMusic = function (query, cb) {
    var self = this;
    this.context.getService('musicModel').add(query.name, query.id, query.date, query.notify, function (err) {
        if (err) {
            cb(err);
        } else {
            self.doGetAllMusic(null, cb);
        }
    });
};

Default.prototype.doEditMusic = function (query, cb) {
    var self = this;
    this.context.getService('musicModel').edit(query.id, query.name, query.vgmid, query.date, query.notify, function (err) {
        if (err) {
            cb(err);
        } else {
            self.doGetAllMusic(null, cb);
        }
    });
};

Default.prototype.doDeletetMusic = function (query, cb) {
    this.context.getService('musicModel').delete(query.id);
    this.doGetAllMusic(null, cb);
};

Default.prototype.doRefreshMusic = function (query, cb) {
    var self = this;
    this.context.getService('musicModel').dataRefresh(function (err) {
        if (err) {
            cb(err);
        } else {
            self.doGetAllMusic(null, cb);
        }
    });
};

/* Shows */

Default.prototype.doGetAllShows = function (query, cb) {
    cb(false, {
        shows: this.context.getService('showModel').getAll()
    });
};

Default.prototype.doGetShow = function (query, cb) {
    cb(false, util._extend({}, this.context.getService('showModel').get(query.id)));
};

Default.prototype.doShowSearch = function (query, cb) {
    var d = new Date();
    this.context.getService('nextEpisode').search(query.search, cb);
};

Default.prototype.doAddShow = function (query, cb) {
    var self = this;
    this.context.getService('showModel').add(query.name, query.link, query.notify, function (err) {
        if (err) {
            cb(err);
        } else {
            self.doGetAllShows(null, cb);
        }
    });
};

Default.prototype.doEditShow = function (query, cb) {
    var self = this;
    this.context.getService('showModel').edit(query.id, query.name, query.link, query.notify, function (err) {
        if (err) {
            cb(err);
        } else {
            self.doGetAllShows(null, cb);
        }
    });
};

Default.prototype.doDeletetShow = function (query, cb) {
    this.context.getService('showModel').delete(query.id);
    this.doGetAllShows(null, cb);
};

Default.prototype.doWatchShow = function (query, cb) {
    var self = this;
    this.context.getService('showModel').watch(query.id, query.date, function (err) {
        if (err) {
            cb(err);
        } else {
            self.doGetAllShows(null, cb);
        }
    });
};

Default.prototype.doRefreshShows = function (query, cb) {
    var self = this;
    this.context.getService('showModel').dataRefresh(function (err) {
        if (err) {
            cb(err);
        } else {
            self.doGetAllShows(null, cb);
        }
    });
};

module.exports = Default;