var fs = require('fs'),
        sanitize = require("sanitize-filename");

var TxtsModel = function (config, context) {
    if (!(this instanceof TxtsModel))
        return new TxtsModel(config, context);

    this.config = config;
    this.context = context;
};

TxtsModel.prototype.getList = function (cb) {
    fs.readdir("./" + this.config.get('dataDir'), function (err, files) {
        if (err) {
            cb(err);
            return;
        }

        var txts = [];
        for (var i in files) {
            if (files[i].match(/\.txt$/i) !== null) {
                txts.push(files[i].replace(/\.txt$/i, ''));
            }
        }
        cb(false, txts);
    });
};

TxtsModel.prototype.get = function (name, cb) {
    var file = "./" + this.config.get('dataDir') + '/' + sanitize(String(name)) + '.txt';

    fs.exists(file, function (exists) {
        if (!exists) {
            console.log('TxtsModel.get - File not exists');
            cb(400);
            return;
        } else {
            fs.readFile(file, function (err, data) {
                if (err) {
                    console.log('TxtsModel.get - Error while reading');
                    cb(err);
                    return;
                }
                cb(false, data.toString());
            });
        }
    });
};

TxtsModel.prototype.add = function (name, content, cb) {
    name = sanitize(String(name)).trim();
    if (name === '') {
        console.log('TxtsModel.add - Blank name');
        cb(400);
        return;
    }
    var file = "./" + this.config.get('dataDir') + '/' + name + '.txt';
    fs.exists(file, function (exists) {
        if (exists) {
            console.log('TxtsModel.add - File already exists');
            cb(400);
            return;
        } else {
            fs.writeFile(file, content, function (err) {
                if (err) {
                    console.log('TxtsModel.add - Error while writting');
                    cb(err);
                    return;
                }
                cb(false, {name: name});
            });
        }
    });
};
TxtsModel.prototype.edit = function (name, data, cb) {
    name = sanitize(String(name));
    var file = "./" + this.config.get('dataDir') + '/' + name + '.txt';

    var content = data.content;
    var newName = sanitize(String(data.newName)).trim();

    var self = this;
    fs.exists(file, function (exists) {
        if (!exists) {
            console.log('TxtsModel.edit - File not exists');
            cb(400);
            return;
        } else {
            fs.writeFile(file, content, function (err) {
                if (err) {
                    console.log('TxtsModel.edit - Error while writting');
                    cb(err);
                    return;
                }

                if (name !== newName) {
                    if (newName === '') {
                        console.log('TxtsModel.edit - Blank name');
                        cb(400);
                        return;
                    }
                    fs.rename(file, self.config.get('dataDir') + '/' + newName + '.txt', function (err) {
                        if (err) {
                            console.log('TxtsModel.edit - Error while renaming');
                            cb(err);
                            return;
                        }

                        name = newName;
                        cb(false, {name: newName});
                    });
                } else {
                    cb(false, {name: name});
                }
            });
        }
    });
};
TxtsModel.prototype.delete = function (name, cb) {
    name = sanitize(String(name));
    var file = "./" + this.config.get('dataDir') + '/' + name + '.txt';

    fs.exists(file, function (exists) {
        if (!exists) {
            console.log('TxtsModel.delete - File not exists');
            cb(400);
            return;
        } else {
            fs.unlink(file, function (err) {
                if (err) {
                    console.log('TxtsModel.delete - Error while deleting');
                    cb(err);
                    return;
                }
                cb(false, null);
            });
        }
    });
};

module.exports = TxtsModel;