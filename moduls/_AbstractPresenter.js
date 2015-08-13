function _AbstractPresenter(modul) {
    if (!(this instanceof _AbstractPresenter))
        return new _AbstractPresenter(modul);

    this.config = modul.getConfig();
    this.context = modul.getContext();

    this.router = modul.getRouter();
    this.modul = modul;

    this.presenterName = this.constructor.name;
}

_AbstractPresenter.prototype.getPresenter = function (action, query, cb) {
    this.callAction(true, action, query, cb);
};

_AbstractPresenter.prototype.getAction = function (action, query, cb) {
    this.callAction(false, action, query, cb);
};

_AbstractPresenter.prototype.callAction = function (isPresenter, action, query, cb) {
    var functionName = 'action' + action.replace(/^[a-z]/i, function ($1) {
        return $1.toUpperCase( );
    });

    var self = this;
    if (typeof this[functionName] !== "undefined") {
        this[functionName](query, function (err, data) {
            if (err)
                cb(err);

            data._ = self.getTranslation();
            data.createLink = {
                this: self.router,
                func: self.router.createLink
            };
            data.modul = self.modul.modulName;

            if (isPresenter) {
                self.context.getService('compiler').getTemplate(self.modul.modulName, 'head', data, function (err, head) {
                    self.context.getService('compiler').getTemplateNoNeed(self.modul.modulName, 'scripts', data, function (err, scripts) {
                        self.context.getService('compiler').getTemplate(self.modul.modulName, self.presenterName + '.' + action, data, function (err, body) {
                            cb(false, {
                                title: data.title,
                                head: head,
                                body: body,
                                scripts: scripts
                            });
                        });
                    });
                });
            } else {
                self.context.getService('compiler').getTemplate(self.modul.modulName, self.presenterName + '.' + action, data, function (err, body) {
                    cb(false, {
                        title: data.title,
                        body: body
                    });
                });
            }
        });
    } else {
        cb(404);
    }
};

_AbstractPresenter.prototype.doSignal = function (signal, query, cb) {
    var functionName = 'do' + signal.replace(/^[a-z]/i, function ($1) {
        return $1.toUpperCase( );
    });

    if (typeof this[functionName] !== "undefined") {
        this[functionName](query, function (err, data) {
            if (err)
                cb(err);

            if (data === null)
                data = {};

            cb(false, data);
        });
    } else {
        cb(404);
    }
};

_AbstractPresenter.prototype.hasAction = function (name) {
    return typeof this['action' + name.replace(/^[a-z]/, function ($1) {
        return $1.toUpperCase();
    })] === 'function';
};

_AbstractPresenter.prototype.hasSignal = function (name) {
    return typeof this['do' + name.replace(/^[a-z]/, function ($1) {
        return $1.toUpperCase();
    })] === 'function';
};

_AbstractPresenter.prototype.getTranslation = function () {
    return this.modul.getTranslation();
};

_AbstractPresenter.prototype.createLink = function (handler, vars) {
    return this.modul.createLink(handler, vars);
};

module.exports = _AbstractPresenter;