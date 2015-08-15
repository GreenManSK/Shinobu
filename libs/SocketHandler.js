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

    this.defaultModul = this.config.get('defaultModul');
    this.errorModul = this.config.get('errorModul');

    this.createRouter();
};

SocketHandler.prototype.modulsOnStart = false;
SocketHandler.prototype.moduls = {};
SocketHandler.prototype.sockets = {
    hasMain: false,
    main: null
};

SocketHandler.prototype.createRouter = function () {
    this.router = this.context.getLib('router')();

    this.router.addRoute('[<modul>/][<presenter>/][<action>/]', this.defaultModul + "::");
    this.router.addRoute('error/<err:\\d\\d\\d>/', this.errorModul + "::");
};

SocketHandler.prototype.findNewMain = function () {
    this.sockets.hasMain = false;
    this.sockets.main = null;
    for (var i in this.sockets) {
        if (i !== 'hasMain' && i !== 'main') {
            if (this.sockets[i].modul === this.defaultModul) {
                this.sockets.hasMain = true;
                this.sockets.main = this.sockets[i];
                this.sockets[i].main = true;
                this.sockets[i].socket.emit('newMain');
                return;
            }
        }
    }
};

SocketHandler.prototype.changeSocket = function (socket, modul) {
    var s = this.sockets[socket.id];
    if (s.modul !== modul) {
        s.modul = modul;
        if (s.main) {
            s.main = false;
            this.findNewMain();
        } else {
            if (!this.sockets.hasMain && s.modul === this.defaultModul) {
                s.main = true;
                this.sockets.hasMain = true;
                this.sockets.main = socket;
            }
        }
    }
};

SocketHandler.prototype.handleConnection = function (socket) {
    var self = this;

    this.sockets[socket.id] = {
        socket: socket,
        modul: null,
        main: false
    };

    socket.on('disconnect', function () {
        var s = self.sockets[socket.id];
        var wasMine = s.main;
        delete self.sockets[socket.id];
        if (wasMine) {
            self.findNewMain();
        }
    });

    socket.on('presenter', function (query) {
        var callback = function (err, data, modul) {
            if (!err) {
                socket.emit('presenter', {
                    'head': data.head,
                    'body': data.body,
                    'scripts': data.scripts,
                    'callback': query.callback,
                    'mainTab': self.sockets[socket.id].main
                });
            } else {
                self.sendErrorPresenter(socket, 404);
            }
        };

        self._getRequestData(true, query, callback, socket);
    });

    socket.on('action', function (query) {
        var callback = function (err, data, modul) {
            if (!err) {
                socket.emit('action', {
                    'title': data.title,
                    'body': data.body,
                    'callback': query.callback,
                    'mainTab': self.sockets[socket.id].main
                });
            } else {
                self.sendErrorAction(socket, 404);
            }
        };

        self._getRequestData(true, query, callback, socket);
    });

    socket.on('doSignal', function (inputData) {
        var callback = function (err, data, modul) {
            if (!err) {
                data.mainTab = self.sockets[socket.id].main;
                socket.emit(inputData.responseEvent, data);
            } else {
                socket.emit(inputData.responseEvent, {error: err});
            }
        };

        self._getActionData(inputData, callback, socket);
    });
};

/* Presenters */
SocketHandler.prototype._getRequestData = function (presenter, data, cb, socket) {
    var self = this;
    this._parseUrl(data, function (err, presenterObjekt, action, query) {
        if (err) {
            cb(err);
            return;
        }

        query.mainTab = false;
        if (socket !== undefined) {
            self.changeSocket(socket, presenterObjekt.modul.modulName);
            if (self.sockets[socket.id].main) {
                query.mainTab = true;
            }
        }

        if (presenter)
            presenterObjekt.getPresenter(action, query, cb);
        else
            presenterObjekt.getAction(action, query, cb);
    });
};

SocketHandler.prototype._getActionData = function (data, cb, socket) {
    var self = this;
    this._parseUrl(data, function (err, presenterObjekt, action, query) {
        if (err) {
            cb(err);
            return;
        }

        query.mainTab = false;
        if (socket !== undefined) {
            self.changeSocket(socket, presenterObjekt.modul.modulName);

            if (self.sockets[socket.id].main) {
                query.mainTab = true;
            }
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
        handler.modul = this.defaultModul;
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

SocketHandler.prototype.sendErrorPresenter = function (socket, error) {
    var callback = function (err, data) {
        socket.emit('presenter', {
            'head': data.head,
            'body': data.body,
            'scripts': data.scripts
        });
    };

    this.changeSocket(socket, this.errorModul);

    var modul = this.createModulInstance(this.errorModul);
    modul.createPresenterInstance('Default').getPresenter("default", {err: error}, callback);
};

SocketHandler.prototype.sendErrorAction = function (socket, error) {
    var callback = function (err, data) {
        socket.emit('action', {
            'title': data.title,
            'body': data.body
        });
    };

    var modul = this.createModulInstance(this.errorModul);
    modul.createPresenterInstance('Default').getAction("default", {err: error}, callback);
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