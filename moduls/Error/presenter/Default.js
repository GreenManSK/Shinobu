var _AbstractPresenter = require('../../_AbstractPresenter.js'),
        util = require('util'),
        http = require('http');

function Default() {
    Default.super_.apply(this, arguments);
}

util.inherits(Default, _AbstractPresenter);

Default.prototype.actionDefault = function (query, cb) {
    cb(false, {
        errorNumber: query.err,
        error: http.STATUS_CODES[query.err]
    });
};

module.exports = Default;