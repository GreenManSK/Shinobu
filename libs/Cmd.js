var util = require('util');
fs = require('fs');

var Cmd = function (config, context) {
    if (!(this instanceof Cmd)) {
        return new Cmd(config, context);
    }

    this.config = config;
    this.context = context;
    this._addCommands();
};

Cmd.prototype.history = [];
Cmd.prototype.commands = {};
Cmd.prototype.help = {};

Cmd.prototype._addCommands = function () {
    this.addCmd(['help', '?', 'stop', 'close'], [this, this.showHelp], null, 'Shows list of commands');
    this.addCmd(['clear'], [this, this.clearHistory], null, 'Clear console (only in browser)');
    
    this.addCmd(['script'], [this, this.callScript], 'name', 'Execute script located in scripts dir');
    
    this.addCmd(['exit', 'end', 'stop', 'close'], process.exit, null, 'Stops program');
};

Cmd.prototype.addCmd = function (names, cb, params, description) {
    if (!util.isArray(names)) {
        names = [names];
    }

    var namesString = '';
    for (var i in names) {
        this.commands[names[i]] = cb;
        if (i > 0) {
            namesString += ', ' + names[i];
        } else {
            namesString = names[i];
        }
    }

    this.help[namesString] = [params, description];
};

Cmd.prototype.showHelp = function () {
    console.log('-------Help-------');
    for (var cmd in this.help) {
        console.log(cmd + (this.help[cmd][0] ? ' | ' + this.help[cmd][0] : '') + ' - ' + this.help[cmd][1]);
    }

    console.log('------------------');
};

Cmd.prototype.start = function () {
    var self = this;
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', function (data) {
        self._addToHistory(data);
        self.parse(data);
    });
    this.context.getLib("intercept-stdout")(function (data) {
        self._addToHistory(data);
    });
};

Cmd.prototype.parse = function (data) {
    this._addToHistory(data);
    data = data.toString().trim().match(/([^\s]+|^$)/g);
    if (data.length > 0) {
        var command = data[0].toLowerCase(), args = [];
        for (var i = 1; i < data.length; i++) {
            args.push(this.cleanArg(data[i]));
        }

        if (typeof this.commands[command] === 'undefined') {
            console.log('Unknow command, use help for list of commands');
        } else {
            var cb = this.commands[command];
            if (util.isArray(cb)) {
                cb[1].apply(cb[0], args);
            } else {
                cb.apply(null, args);
            }
        }
    }
};

Cmd.prototype.cleanArg = function (arg) {
    if (typeof arg === 'undefined')
        return null;
    arg = arg.trim();
    switch (arg[0]) {
        case "'":
            arg = arg.replace(/'/g, '');
            break;
        case '"':
            arg = arg.replace(/"/g, '');
            break;
    }
    return arg;
};

Cmd.prototype._addToHistory = function (data) {
    this.history.push(data.toString().trim());
    var maxLength = this.config.get('cmd.maxLength', 50);
    if (this.history.length > maxLength) {
        this.history.slice(this.history.length - maxLength, this.history.length);
    }
};

Cmd.prototype.getHistory = function (length) {
    if (length === undefined)
        return this.history;
    var begin = 0, end = this.history.length - 1;
    if (length < this.history.length) {
        begin = this.history.length - length - 1;
    }

    return this.history.slice(begin, end);
};

Cmd.prototype.clearHistory = function () {
    this.history = [];
};

Cmd.prototype.callScript = function (name) {
    name = name.replace(/\.\./g, '.').replace(/\.(\/|\\)/g);
    if (name.match(/\.js$/i) === null)
        name += '.js';
    if (fs.existsSync('scripts/' + name)) {
        require('../scripts/' + name)(this.context, this.config);
    } else {
        console.log('Script ' + name + ' dosen\' exist.');
    }
};

module.exports = Cmd;