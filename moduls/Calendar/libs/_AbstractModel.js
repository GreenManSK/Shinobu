var fs = require('fs');
var util = require("util");
var moment = require('moment');

function _AbstractModel(config, context) {
    if (!(this instanceof _AbstractModel)) {
        return new _AbstractModel(config, context);
    }

    this.config = config;
    this.context = context;

    this.data = [];

    if (!this.fileName)
        throw "You must define fileName for Calendar Model";

    this.load();
    this.context.getService("saver").add([this, this.save]);
}

_AbstractModel.prototype.useSubdates = false;

_AbstractModel.prototype.save = function () {
    fs.writeFileSync("./" + this.config.get('dataDir') + "/" + this.fileName + ".json", JSON.stringify(this.data, null, '    '));
};

_AbstractModel.prototype.load = function () {
    var content = '[]';

    if (fs.existsSync("./" + this.config.get('dataDir') + "/" + this.fileName + ".json"))
        content = fs.readFileSync("./" + this.config.get('dataDir') + "/" + this.fileName + ".json").toString();

    this.data = JSON.parse(content);
};

_AbstractModel.prototype.getNextId = function () {
    var id = 0;
    for (var i in this.data) {
        if (this.data[i].id > id)
            id = this.data[i].id;
    }
    return id + 1;
};

_AbstractModel.prototype.getAll = function (fnc, fnc2) {
    var data = [];

    var now = new Date();

    for (var i in this.data) {
        var o = util._extend({}, this.data[i]);
        
        if (typeof fnc === "function") {
            o = fnc(o);
        }

        if (this.useSubdates) {
            if (o.dates.length === 0) {
                o.released = false;
                o.date = '';
                o.dateObject = new Date(o.date);
                data.push(o);
            } else {
                for (var j in o.dates) {
                    var _o = util._extend({}, o);

                    _o.dateObject = new Date(o.dates[j][0]);
                    _o.released = now >= _o.dateObject;
                    _o.dateForm = moment(_o.dateObject).format('YYYY-MM-DD');
                    _o.date = moment(_o.dateObject).format('DD.MM.YYYY');
                    if (_o.name) {
                        _o.name += ' ' + o.dates[j][1];
                    }
                    _o.epno = o.dates[j][1];

                    if (typeof fnc2 === "function") {
                        _o = fnc2(_o);
                    }

                    data.push(_o);
                }
            }
        } else {
            o.dateObject = new Date(o.date);
            o.released = o.date && now >= o.dateObject;
            o.dateForm = o.date ? moment(o.date).format('YYYY-MM-DD') : '';
            o.date = o.date ? moment(o.date).format('DD.MM.YYYY') : '';
            data.push(o);
        }
    }

    function compare(a, b) {
        if (a.dateObject < b.dateObject)
            return 1;
        if (a.dateObject > b.dateObject)
            return -1;
        return 0;
    }

    return data.sort(compare);
};

_AbstractModel.prototype.get = function (id) {
    id = parseInt(id);

    for (var i in this.data) {
        if (this.data[i].id === id) {
            return this.data[i];
        }
    }
};

_AbstractModel.prototype.add = function (data, cb) {
    var o = {
        id: this.getNextId()
    };

    for (var i in data) {
        o[i] = data[i];
    }

    if (this.useSubdates) {
        o.dates = [];
    }

    var self = this;
    if (typeof this.getItemData === "function") {
        this.getItemData(o, function (err, o) {
            if (err) {
                cb(err);
            } else {
                self.data.push(o);
                cb(false);
            }
        });
    } else {
        this.data.push(o);
        cb(false);
    }
};

_AbstractModel.prototype.edit = function (id, data, cb) {
    var o = this.get(id);
    if (!o) {
        cb(true);
        return;
    }

    for (var i in data) {
        o[i] = data[i];
    }

    if (typeof this.getItemData === "function") {
        this.getItemData(o, cb);
    } else {
        cb(false);
    }
};

_AbstractModel.prototype.delete = function (id) {
    id = parseInt(id);
    for (var i in this.data) {
        if (this.data[i].id === id) {
            var p = this.data.indexOf(this.data[i]);
            if (p !== -1) {
                this.data.splice(p, 1);
            }
            return;
        }
    }
};

_AbstractModel.prototype.dataRefresh = function (cb) {
    if (this.data.length === 0 || typeof this.getItemData !== "function") {
        cb(false);
        return;
    }

    var c = 0;
    var self = this;

    for (var i in this.data) {
        this.getItemData(this.data[i], function () {
            c += 1;
            if (c === self.data.length) {
                cb(false);
            }
        });
    }
};


module.exports = _AbstractModel;