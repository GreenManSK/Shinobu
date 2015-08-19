var fs = require('fs');

var LinksModel = function (config, context) {
    if (!(this instanceof LinksModel))
        return new LinksModel(config, context);

    this.config = config;
    this.context = context;

    this.links = [];

    this.loadLinks();
    this.context.getService("saver").add([this, this.saveLinks]);
};

LinksModel.prototype.saveLinks = function () {
    fs.writeFileSync("./" + this.config.get('dataDir') + "/links.json", JSON.stringify(this.links, null, '    '));
};

LinksModel.prototype.loadLinks = function () {
    var content = '[]';

    if (fs.existsSync("./" + this.config.get('dataDir') + "/links.json"))
        content = fs.readFileSync("./" + this.config.get('dataDir') + "/links.json").toString();

    this.links = JSON.parse(content);
};

LinksModel.prototype.getLinks = function () {
    return this.links;
};

LinksModel.prototype.changeOrder = function (order, cb) {
    if (this.links.length !== order.length) {
        console.log('LinksModel.changeOrder - Length mismatch');
        cb(400);
        return;
    }

    var newLinks = [];
    for (var i in order) {
        if (typeof this.links[order[i]] === 'undefined') {
            console.log('LinksModel.changeOrder - Undefined index');
            cb(400);
            return;
        }
        newLinks.push(this.links[order[i]]);
    }

    this.links = newLinks;
    cb(false, null);
};

LinksModel.prototype.addLink = function (url, title, img, icon, cb) {
    this.links.push({
        title: title,
        url: url,
        icon: icon,
        img: img
    });

    cb(false, null);
};

LinksModel.prototype.editLink = function (index, url, title, img, icon, cb) {
    if (typeof this.links[index] === 'undefined') {
        console.log('LinksModel.editLink - Unknown index');
        cb(404);
        return;
    }

    this.links[index] = {
        title: title,
        url: url,
        icon: icon,
        img: img
    };

    cb(false, null);
};

LinksModel.prototype.deleteLink = function (index, cb) {
    if (typeof this.links[index] === 'undefined') {
        console.log('LinksModel.deleteLink - Unknown index');
        cb(404);
        return;
    }

    delete this.links[index];
    this.links.length = this.links.length - 1;

    cb(false, null);
};

module.exports = LinksModel;