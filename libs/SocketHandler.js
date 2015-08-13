var url = require('url');
var fs = require('fs');

var SocketHandler = function (config, context) {
    if (!(this instanceof SocketHandler)) {
        return new SocketHandler(config, context);
    }

    this.config = config;
    this.context = context;

    if (this.config.get('loadingOnStart.moduls')) {
        this.modulsOnStart = true;
        this.loadModuls();
    }

    this.createRouter();
};

SocketHandler.prototype.modulsOnStart = false;
SocketHandler.prototype.moduls = {};

SocketHandler.prototype.createRouter = function () {
    this.router = this.context.getLib('router')();

    this.router.addRoute('[<modul>/][<presenter>/][<action>/]', this.config.get('defaultModul') + "::");
//    this.router.addRoute('error/<err:\\d\\d\\d>/', "Errror:Default:default");
};

SocketHandler.prototype.handleConnection = function (socket) {
    var self = this;

    /*presenter, action, signal(do), disconnection*/
    socket.on('presenter', function (query) {
        var callback = function (err, data) {
            if (!err) {
                socket.emit('presenter', {
                    'head': data.head,
                    'body': data.body,
                    'scripts': data.scripts,
                    'callback': query.callback
                });
            } else {
//                self.sendErrorPresenter(socket, 404);
            }
        };

        self._getRequestData(true, query, callback);
    });

    socket.on('action', function (query) {
        var callback = function (err, data) {
            if (!err) {
                socket.emit('action', {
                    'title': data.title,
                    'body': data.body,
                    'callback': query.callback
                });
            } else {
//                self.sendErrorAction(socket, 404);
            }
        };

        self._getRequestData(true, query, callback);
    });

    socket.on('doSignal', function (inputData) {
        var callback = function (err, data) {
            if (!err) {
                socket.emit(inputData.responseEvent, data);
            } else {
                socket.emit(inputData.responseEvent, {error: err});
            }
        };

        self._getActionData(inputData, callback);
    });
};

/* Presenters */
SocketHandler.prototype._getRequestData = function (presenter, data, cb) {
    this._parseUrl(data, function (err, presenterObjekt, action, query) {
        if (err) {
            cb(err);
            return;
        }

        if (presenter)
            presenterObjekt.getPresenter(action, query, cb);
        else
            presenterObjekt.getAction(action, query, cb);
    });
};

SocketHandler.prototype._getActionData = function (data, cb) {
    this._parseUrl(data, function (err, presenterObjekt, action, query) {
        if (err) {
            cb(err);
            return;
        }

        presenterObjekt.doSignal(action, query, cb);
    });
};

SocketHandler.prototype._parseUrl = function (data, cb) {
    var parsedUrl = url.parse(data.url, true);
    var path = this._friendlyPath(parsedUrl.pathname).replace(/^\//, '');

    if (path.match(/\/$/) === null) {
        path += '/';
    }
    var dispatchedPath = this.router.dispatch(path);
    var handler = dispatchedPath.handler;
    if (!this.hasModul(handler.modul)) {
        handler.action = handler.presenter;
        handler.presenter = handler.modul;
        handler.modul = this.config.get('defaultModul');
    }

    var modul = this.createModulInstance(handler.modul);


    if (!modul || !modul.hasPresenter(handler.presenter)) {
        cb(404);
    } else {
        var query = parsedUrl.query;
        for (var attrname in dispatchedPath.vars) {
            query[attrname] = dispatchedPath.vars[attrname];
        }
        for (var attrname in data) {
            if (attrname !== 'url' || attrname !== 'responseEvent') {
                switch (attrname) {
                    case '_url':
                        query['url'] = data[attrname];
                        break;
                    case '_responseEvent':
                        query['responseEvent'] = data[attrname];
                        break;
                    default:
                        query[attrname] = data[attrname];
                }
            }
        }

        var presenter = modul.createPresenterInstance(handler.presenter);
        cb(false, presenter, dispatchedPath.handler.action, query);
    }
};

/* Moduls */
SocketHandler.prototype.hasModul = function (name) {
    if (this.modulsOnStart) {
        return typeof this.moduls[name] !== 'undefined';
    } else {
        return fs.existsSync('moduls/' + name);
    }
};

SocketHandler.prototype.createModulInstance = function (name) {
    if (this.modulsOnStart) {
        if (typeof this.moduls[name] === 'undefined') {
            console.log('Modul ' + name + ' doesn\'t exist');
            return false;
        } else {
            return new this.moduls[name](this.config, this.context, this.router);
        }
    } else {
        if (fs.existsSync('moduls/' + name)) {
            var t = this._loadModul(name);
            return new t(this.config, this.context, this.router);
        } else {
            console.log('Modul ' + name + ' doesn\'t exist');
            return false;
        }
    }
};

SocketHandler.prototype.loadModuls = function () {
    var moduls = fs.readdirSync('moduls');
    for (var i in moduls) {
        var stats = fs.statSync('moduls/' + moduls[i]);
        if (stats.isDirectory())
            this.moduls[moduls[i]] = this._loadModul(moduls[i]);
    }
};

SocketHandler.prototype._loadModul = function (name) {
    return require('../moduls/' + name + '/' + name + '.js');
};

SocketHandler.prototype._friendlyPath = function (path) {
    return decodeURIComponent(path).replace(/\.+/g, '.').replace(/\/$/, '');
};

module.exports = SocketHandler;