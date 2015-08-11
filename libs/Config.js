var fs = require('fs');

var Config = function (file) {
    if (!(this instanceof Config)) {
        return new Config(file);
    }

    this._load(file);
};

Config.prototype._load = function (file) {
    this.file = file;

    if (!fs.existsSync(file)) {
        throw "Didn't found config file";
    }

    this.config = JSON.parse(fs.readFileSync(file).toString());
};

Config.prototype.get = function (property, defaultValue) {
    var path = property.match(/([^\.]+)/g),
            last = this.config;

    if (path.length === 0) {
        return defaultValue;
    }

    for (var i in path) {
        if (typeof last[path[i]] !== 'undefined') {
            last = last[path[i]];
        } else {
            return defaultValue;
        }
    }

    return last;
};

Config.prototype.has = function (property) {
    return typeof this.get(property) !== 'undefined';
};

Config.prototype.set = function (property, value) {
    var path = property.match(/([^\.]+)/g),
            last = this.config;

    for (var i in path) {
        if (typeof last[path[i]] !== 'undefined') {
            last = last[path[i]];
        } else {
            if (path[i] !== path[path.length - 1]) {
                last[path[i]] = {};
                last = last[path[i]];
            } else {
                last[path[i]] = value;
            }
        }
    }
};

Config.prototype.remove = function (property) {
    var path = property.match(/([^\.]+)/g),
            last = this.config;

    for (var i = 0; i < path.length; i++) {
        if (typeof last[path[i]] !== 'undefined') {
            if (i !== path.length - 1) {
                last = last[path[i]];
            }
        } else {
            throw "Property " + property + " doesn't exists in config.";
        }
    }

    delete last[path[path.length - 1]];
    delete path[path.length - 1];
    path.length = path.length - 1;
    var newPath = path.join(".");

    if (newPath !== '' && Object.keys(this.get(newPath)).length === 0) {
        this.remove(newPath);
    }
};

Config.prototype.setAndSave = function (property, value) {
    this.set(property, value);
    this.save();
};

Config.prototype.removeAndSave = function (property, value) {
    this.remove(property, value);
    this.save();
};

Config.prototype.save = function () {
    fs.writeFileSync(this.file, JSON.stringify(this.config, null, '    '));
};

module.exports = Config;
