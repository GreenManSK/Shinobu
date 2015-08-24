var _AbstractPresenter = require('../../_AbstractPresenter.js'),
        util = require('util');

function Default() {
    Default.super_.apply(this, arguments);
}

util.inherits(Default, _AbstractPresenter);

Default.prototype.actionDefault = function (query, cb) {
    cb(false, {
        music: this.context.getService('musicModel').getAll(),
        shows: this.context.getService('showModel').getAll(),
        ova: this.context.getService('ovaModel').getAll(),
        anime: this.context.getService('animeModel').getAll()
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

/* OVA */

Default.prototype.doGetAllOva = function (query, cb) {
    cb(false, {
        ova: this.context.getService('ovaModel').getAll()
    });
};

Default.prototype.doGetOva = function (query, cb) {
    cb(false, util._extend({}, this.context.getService('ovaModel').get(query.id)));
};

Default.prototype.doAddOva = function (query, cb) {
    var self = this;
    this.context.getService('ovaModel').add(query.name, query.aid, query.eid, query.nyaa, query.date, query.notifyDate, query.notifyFile, function (err) {
        if (err) {
            cb(err);
        } else {
            self.doGetAllOva(null, cb);
        }
    });
};

Default.prototype.doEditOva = function (query, cb) {
    var self = this;
    this.context.getService('ovaModel').edit(query.id, query.name, query.aid, query.eid, query.nyaa, query.date, query.notifyDate, query.notifyFile, function (err) {
        if (err) {
            cb(err);
        } else {
            self.doGetAllOva(null, cb);
        }
    });
};

Default.prototype.doDeletetOva = function (query, cb) {
    this.context.getService('ovaModel').delete(query.id);
    this.doGetAllOva(null, cb);
};

Default.prototype.doRefreshOva = function (query, cb) {
    var self = this;
    this.context.getService('ovaModel').dataRefresh(function (err) {
        if (err) {
            cb(err);
        } else {
            self.doGetAllOva(null, cb);
        }
    });
};

Default.prototype.doOvaSearch = function (query, cb) {
    this.context.getService('aniDb').getAnimeData(query.id, cb);
};

/* Anime */

Default.prototype.doAnimeSearch = function (query, cb) {
    cb(false, this.context.getService('aniDb').search(query.search));
};

Default.prototype.doGetAllAnime = function (query, cb) {
    cb(false, {
        anime: this.context.getService('animeModel').getAll()
    });
};

Default.prototype.doGetAnime = function (query, cb) {
    cb(false, util._extend({}, this.context.getService('animeModel').get(query.id)));
};

Default.prototype.doAddAnime = function (query, cb) {
    var self = this;
    this.context.getService('animeModel').add(query.name, query.aid, query.nyaa, query.notifyDate, query.notifyFile, function (err) {
        if (err) {
            cb(err);
        } else {
            self.doGetAllAnime(null, cb);
        }
    });
};

Default.prototype.doEditAnime = function (query, cb) {
    var self = this;
    this.context.getService('animeModel').edit(query.id, query.name, query.aid, query.nyaa, query.notifyDate, query.notifyFile, function (err) {
        if (err) {
            cb(err);
        } else {
            self.doGetAllAnime(null, cb);
        }
    });
};

Default.prototype.doDeletetAnime = function (query, cb) {
    this.context.getService('animeModel').delete(query.id);
    this.doGetAllAnime(null, cb);
};

Default.prototype.doWatchAnime = function (query, cb) {
    var self = this;
    this.context.getService('animeModel').watch(query.id, query.date, function (err) {
        if (err) {
            cb(err);
        } else {
            self.doGetAllAnime(null, cb);
        }
    });
};

Default.prototype.doRefreshAnime = function (query, cb) {
    var self = this;
    this.context.getService('animeModel').dataRefresh(function (err) {
        if (err) {
            cb(err);
        } else {
            self.doGetAllAnime(null, cb);
        }
    });
};

module.exports = Default;