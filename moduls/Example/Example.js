var _AbstractModul = require('../_AbstractModul.js'),
        util = require('util');

function Example() {
    Example.super_.apply(this, arguments);

    this.updateContext();
}

util.inherits(Example, _AbstractModul);

Example.prototype.updateContext = function () {
    this.getContext().addService('dateCheck', require('./libs/DateControler')(this.getConfig().get("birthday", "15.11")));
};

module.exports = Example;