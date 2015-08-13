var _AbstractModul = require('../_AbstractModul.js'),
        util = require('util');

function Error() {
    Error.super_.apply(this, arguments);
}

util.inherits(Error, _AbstractModul);

module.exports = Error;