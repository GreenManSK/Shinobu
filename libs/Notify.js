var fs = require('fs');
var util = require("util");

var Notify = function (config, context) {
    if (!(this instanceof Notify)) {
        return new Notify(config, context);
    }

    this.config = config;
    this.context = context;

    this.load();
    this.context.getService("saver").add([this, this.save]);
};

Notify.prototype.notifications = {};

Notify.prototype.load = function () {
    var content = '{}';

    if (fs.existsSync("./" + this.config.get('dataDir') + "/notify.json"))
        content = fs.readFileSync("./" + this.config.get('dataDir') + "/notify.json").toString();

    this.notifications = JSON.parse(content);
};

Notify.prototype.get = function (id) {
    return this.notifications[id];
};

Notify.prototype.getAll = function () {
    var build = [];
    for (var i in this.notifications) {
        var o = util._extend({}, this.notifications[i]);
        o.id = i;
        build.push(o);
    }
    return build.reverse();
};

Notify.prototype.save = function () {
    fs.writeFileSync("./" + this.config.get('dataDir') + "/notify.json", JSON.stringify(this.notifications, null, '    '));
};

Notify.prototype.add = function (title, body, link, icon, img, color) {
    var i = 0, id;
    do {
        id = Date.now() + i++;
    } while (typeof this.notifications[id] !== 'undefined');
    id = 'n' + id;

    this.notifications[id] = {
        title: title,
        body: body ? body : null,
        link: link ? link : null,
        icon: icon ? icon : null,
        img: img ? img : null,
        color: color ? color : null,
        seen: false
    };

    if (this.notifications.length > this.config.get('maxNotifications')) {
        for (var i in this.notifications) {
            delete this.notifications[i];
            break;
        }
    }

    if (this.context.getService('socketHandler').sockets.hasMain) {
        this.context.getService('socketHandler').sockets.main.emit('notification', [id, this.notifications[id]]);
    }
};

Notify.prototype.edit = function (id, data) {
    if (typeof this.notifications[id] !== 'undefined') {
        for (var i in data) {
            if (typeof this.notifications[id][i] !== 'undefined')
                this.notifications[id][i] = data[i];
        }
    }
};

Notify.prototype.delete = function (id) {
    if (typeof this.notifications[id] !== 'undefined') {
        delete this.notifications[id];
    }
};

Notify.prototype.seenAll = function (id) {
    for (var i in this.notifications) {
        this.notifications[i].seen = true;
        if (id === i)
            break;
    }
};

module.exports = Notify;
