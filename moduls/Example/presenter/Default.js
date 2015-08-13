var _AbstractPresenter = require('../../_AbstractPresenter.js'),
        util = require('util');

function Default() {
    Default.super_.apply(this, arguments);
}

util.inherits(Default, _AbstractPresenter);

Default.prototype.actionDefault = function (query, cb) {
    cb(false, {
        birthday: this.context.getService('dateCheck').check(),
        rand: Math.random()
    });
};

Default.prototype.doGetDate = function (query, cb) {
    cb(false, {
        msg: util.format(this.getTranslation().birthday.real, '15.11.1985')
    });
};

module.exports = Default;