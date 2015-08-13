var fs = require('fs');

function _AbstractModul(config, context, router) {
    if (!(this instanceof _AbstractModul))
        return new _AbstractModul(config, context, router);

    this.config = config;
    this.context = context;

    this.router = router;

    this.modulName = this.constructor.name;

    if (this.config.get('loadingOnStart.presenters')) {
        this.presentersOnStart = true;
        this.loadPresenters();
    }

    this.modulConfig = this.context.getLib('config')(this.config.get(this.modulName + 'Modul', {}));
    this.modulContext = this.context.getLib('context')(this.modulConfig);
}

_AbstractModul.prototype.presentersOnStart = false;
_AbstractModul.prototype.presenters = {};

_AbstractModul.prototype.modulConfig = null;
_AbstractModul.prototype.modulContext = null;

_AbstractModul.prototype.getConfig = function () {
    return this.modulConfig;
};
_AbstractModul.prototype.getContext = function () {
    return this.modulContext;
};
_AbstractModul.prototype.getRouter = function () {
    return this.router;
};

_AbstractModul.prototype.getTranslation = function () {
    return this.context.getService('translator').getTranslation(this.modulName, this.config.get('lang'));
};

_AbstractModul.prototype.createLink = function (handler, vars) {
    return this.router.createLink(handler, vars);
};

_AbstractModul.prototype.hasPresenter = function (name) {
    if (this.presentersOnStart) {
        return typeof this.presenters[name] !== 'undefined';
    } else {
        return fs.existsSync('moduls/' + this.modulName + '/presenter/' + name + '.js');
    }
};

_AbstractModul.prototype.createPresenterInstance = function (name) {
    if (this.presentersOnStart) {
        if (typeof this.presenters[name] === 'undefined') {
            console.log('Presenter ' + name + ' in modul ' + this.modulName + ' doesn\'t exist');
            return false;
        } else {
            return new this.presenters[name](this);
        }
    } else {
        if (fs.existsSync('moduls/' + this.modulName + '/presenter/' + name + '.js')) {
            var t = this._loadPresenter(name);
            return new t(this);
        } else {
            console.log('Presenter ' + name + ' in modul ' + this.modulName + ' doesn\'t exist');
            return false;
        }
    }
};

_AbstractModul.prototype.loadPresenters = function () {
    var presenters = fs.readdirSync('moduls/' + this.modulName + '/presenter');

    for (var i in presenters) {
        var name = presenters[i].replace(/\.js$/i, '');
        this.presenters[name] = this._loadPresenter(name);
    }
};

_AbstractModul.prototype._loadPresenter = function (name) {
    return require('../moduls/' + this.modulName + '/presenter/' + name + '.js');
};

module.exports = _AbstractModul;