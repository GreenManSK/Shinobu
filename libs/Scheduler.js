var fs = require('fs');

var Scheduler = function (config, context) {
    if (!(this instanceof Scheduler)) {
        return new Scheduler(config, context);
    }

    this.config = config;
    this.context = context;

    this.refreshRate = 1000;
    this.tasks = {};
    this.persistent = {};
    this.delay = {};
};

Scheduler.prototype.start = function () {
    this.loadPersistent();

    this.context.getService("saver").add([this, this.savePersistent]);

    setTimeout(this.do.bind(this), this.refreshRate);
};

Scheduler.prototype.loadPersistent = function () {
    var content = '{}';

    if (fs.existsSync("./" + this.config.get('dataDir') + "/scheduler.json"))
        content = fs.readFileSync("./" + this.config.get('dataDir') + "/scheduler.json").toString();

    this.persistent = JSON.parse(content);
};

Scheduler.prototype.savePersistent = function () {
    fs.writeFileSync("./" + this.config.get('dataDir') + "/scheduler.json", JSON.stringify(this.persistent, null, '    '));
};

Scheduler.prototype.once = function (name, fn, when, persistent) {
    var last, next;
    if (when instanceof Date) {
        last = 0;
        next = when.getTime();
    } else {
        last = Date.now();
        next = when * 1000;
    }
    this.add(name, fn, last, next, false, persistent);
};

Scheduler.prototype.every = function (name, fn, persistent, s, m, h, d) {
    if (!s)
        s = 0;
    if (!m)
        m = 0;
    if (!h)
        h = 0;
    if (!d)
        d = 0;
    var next = 1000 * (s + 60 * (m + 60 * (h + 24 * d)));
    this.add(name, fn, Date.now(), next, true, persistent);
};

Scheduler.prototype.add = function (name, fn, last, next, repeat, persistent) {
    var task = {
        persistent: Boolean(persistent),
        fn: fn,
        once: !repeat,
        last: last,
        next: next
    };

    if (task.persistent) {
        if (typeof this.persistent[name] !== 'undefined') {
            task.last = this.persistent[name];
        } else {
            this.persistent[name] = task.last;
        }
    }

    this.tasks[name] = task;
};

Scheduler.prototype.do = function () {
    var now = Date.now();

    for (var i in this.tasks) {
        var task = this.tasks[i];
        var execute = false;
        if (typeof this.delay[i] !== 'undefined') {
            execute = Math.round(now - this.delay[i].last) >= this.delay[i].next;
        } else {
            execute = Math.round(now - task.last) >= task.next;
        }

        if (execute) {
            var r = task.fn();

            if (r === false) {
                if (typeof this.delay[i] === 'undefined')
                    this.delay[i] = {x: 0};

                this.delay[i].last = Date.now();
                if (this.delay[i].x < 7)
                    this.delay[i].x++;
                this.delay[i].next = 2 * Math.exp(this.delay[i].x) * 1000;
            } else {
                if (typeof this.delay[i] !== 'undefined')
                    delete this.delay[i];
                if (task.once) {
                    delete this.tasks[i];
                } else {
                    task.last = Date.now();
                    if (task.persistent)
                        this.persistent[i] = task.last;
                }
            }
        }
    }

    setTimeout(this.do.bind(this), this.refreshRate);
};

module.exports = Scheduler;