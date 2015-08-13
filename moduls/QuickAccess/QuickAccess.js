var _AbstractModul = require('../_AbstractModul.js'),
        util = require('util');

function QuickAccess() {
    QuickAccess.super_.apply(this, arguments);

    this.updateContext();
}

util.inherits(QuickAccess, _AbstractModul);

QuickAccess.prototype.updateContext = function () {
    this.getContext().addService('linksModel', 'moduls/' + this.modulName + '/libs/linksModel');
    this.getContext().addService('siteParser', 'moduls/' + this.modulName + '/libs/siteParser');
    this.getContext().addService('txtsModel', 'moduls/' + this.modulName + '/libs/txtsModel');
};

module.exports = QuickAccess;