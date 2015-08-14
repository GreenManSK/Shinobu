var _AbstractPresenter = require('../../_AbstractPresenter.js'),
        util = require('util');

function Default() {
    Default.super_.apply(this, arguments);
}

util.inherits(Default, _AbstractPresenter);

Default.prototype.actionDefault = function (query, cb) {
    var self = this;

    this.context.getService('txtsModel').getList(function (err, txts) {
        if (err) {
            cb(err);
            return;
        }

        var returnData = {
            links: self.context.getService('linksModel').getLinks(),
            txts: txts
        };

        if (query.mainTab) {
            returnData.console = self.context.getService("cmd").getHistory();
        }

        if (txts.length > 0) {
            var active = txts[0];
            if (typeof query.cookies !== 'undefined' && query.cookies.note) {
                for (var i in txts) {
                    if (txts[i] === query.cookies.note)
                        active = txts[i];
                }
            }

            self.context.getService('txtsModel').get(active, function (err, content) {
                if (err) {
                    cb(err);
                    return;
                }

                returnData.noteTitle = active;
                returnData.noteText = content;

                cb(false, returnData);
            });
        } else {
            cb(false, returnData);
        }
    });
};

/* Links */

Default.prototype.doParseUrl = function (query, cb) {
    this.context.getService('siteParser').parse(query.url, cb);
};

Default.prototype.doOrder = function (query, cb) {
    this.context.getService('linksModel').changeOrder(query.newOrder, cb);
};

Default.prototype.doAddLink = function (query, cb) {
    this.context.getService('linksModel').addLink(query.url, query.title, query.img, query.icon, cb);
};

Default.prototype.doEditLink = function (query, cb) {
    this.context.getService('linksModel').editLink(query.index, query.url, query.title, query.img, query.icon, cb);
};

Default.prototype.doDeleteLink = function (query, cb) {
    this.context.getService('linksModel').deleteLink(query.index, cb);
};

/* Notes */

Default.prototype.doGetNote = function (query, cb) {
    this.context.getService('txtsModel').get(query.name, cb);
};

Default.prototype.doAddNote = function (query, cb) {
    this.context.getService('txtsModel').add(query.name, query.content, cb);
};

Default.prototype.doEditNote = function (query, cb) {
    this.context.getService('txtsModel').edit(query.name, {newName: query.newName, content: query.content}, cb);
};

Default.prototype.doDeleteNote = function (query, cb) {
    this.context.getService('txtsModel').delete(query.name, cb);
};

/* Console */
Default.prototype.doGetConsole = function (query, cb) {
    cb(false, this.context.getService("cmd").getHistory());
};
Default.prototype.doParseCmd = function (query, cb) {
    this.context.getService("cmd").parse(query.cmd);
    cb(false, this.context.getService("cmd").getHistory());
};

module.exports = Default;