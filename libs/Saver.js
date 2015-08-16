var Saver = function (config, context) {
    if (!(this instanceof Saver)) {
        return new Saver(config, context);
    }

    this.config = config;
    this.context = context;

    setInterval(this.saveAll.bind(this), this.config.get('saveInterval'));
    process.on('exit', this.saveAll.bind(this));
};

Saver.prototype.cbs = [];

Saver.prototype.saveAll = function () {
    console.log('Saving data...');
    for (var i in this.cbs) {
        if (typeof this.cbs[i] === 'function')
            this.cbs[i]();
        else
            this.cbs[i][1].bind(this.cbs[i][0])();
    }
    console.log('Data saved!');
};

Saver.prototype.add = function (cb) {
    this.cbs.push(cb);
};

Saver.prototype.remove = function (cb) {
    for (var i in this.cbs) {
        if ((typeof this.cbs[i] === 'function' && this.cbs[i] === cb)
                || (typeof this.cbs[i] !== 'function' && this.cbs[i][0] === cb[0] && this.cbs[i][1] === cb[1])) {
            delete this.cbs[i];
        }
    }
};

module.exports = Saver;