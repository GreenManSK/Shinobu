var urlModule = require('url');
var cheerio = require('cheerio');
var https = require('https');
var fs = require('fs');

function Notifier(config, context) {
    if (!(this instanceof Notifier))
        return new Notifier(config, context);
    this.config = config;
    this.context = context;

    this.data = {};
    for (var i in this.models)
        this.data[i] = {};
    this.fileName = 'notifier';

    this.load();
    this.context.getService("saver").add([this, this.save]);
}

Notifier.prototype.models = ['anime', 'ova', 'music', 'show'];

Notifier.prototype.save = function () {
    fs.writeFileSync("./" + this.config.get('dataDir') + "/" + this.fileName + ".json", JSON.stringify(this.data, null, '    '));
};

Notifier.prototype.load = function () {
    var content = JSON.stringify(this.data);

    if (fs.existsSync("./" + this.config.get('dataDir') + "/" + this.fileName + ".json"))
        content = fs.readFileSync("./" + this.config.get('dataDir') + "/" + this.fileName + ".json").toString();

    this.data = JSON.parse(content);
};

Notifier.prototype.check = function (cb) {
    this.checkDates();
    cb(false);
};

Notifier.prototype.checkDates = function () {
    var now = new Date();

    for (var i in this.models) {
        var m = this.context.getService(this.models[i] + 'Model');
        var data = m.getAll();
        for (var j in data) {
            if (now >= data[j].dataObject && (typeof this.data[i][j] === 'undefined' || this.data[i][j] < data[j].dataObject)) {
                this.data[i][j] = data[j].dataObject;
                var title, link, icon;
                this.context.getService('notify').add(title, null, link, icon);
            }
        }
    }
};

module.exports = Notifier;