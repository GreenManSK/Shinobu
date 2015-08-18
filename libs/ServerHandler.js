var http = require('http');
var fs = require('fs');
var url = require('url');
var mmm = require('mmmagic'),
        Magic = mmm.Magic;
var magic = new Magic(mmm.MAGIC_MIME_TYPE | mmm.MAGIC_MIME_ENCODING);

var ServerHandler = function (config, context) {
    if (!(this instanceof ServerHandler)) {
        return new ServerHandler(config, context);
    }

    this.config = config;
    this.context = context;

    this.createRouter();
};

ServerHandler.prototype.createRouter = function () {
    this.router = this.context.getLib('router')();

    this.router.addRoute('<parent>/translation.js', "translation::");
    this.router.addRoute('[<parent>/]files/<file>', "files::");
    this.router.addRoute('[<parent>/]js/<file>.js', "js::");
    this.router.addRoute('<parent>/css/<file>.css', "css::");
};

ServerHandler.prototype.handleRequest = function (req, res) {
    var parsedUrl = url.parse(req.url, true);
    var path = this._friendlyPath(parsedUrl.pathname).trim();

    var dispatchedPath = this.router.dispatch(path);

    if (dispatchedPath) {
        dispatchedPath.vars.parent = this.router.fromUrlCase(dispatchedPath.vars.parent).replace(/^[a-z]/i, function ($1) {
            return $1.toUpperCase( );
        });
        switch (dispatchedPath.handler.modul) {
            case 'files':
                this._sendFile(res, dispatchedPath.vars.parent, dispatchedPath.vars.file);
                return;
            case 'js':
                this._sendJavascript(res, dispatchedPath.vars.parent, dispatchedPath.vars.file);
                return;
            case 'css':
                this._sendCss(res, dispatchedPath.vars.parent, dispatchedPath.vars.file);
                return;
            case 'translation':
                this._sendTranslation(res, dispatchedPath.vars.parent);
                return;
        }
    }
    
    if (req.url.match(/\/(\?.*)?$/) === null) {
        res.writeHead(301, {
            'Location': req.url + '/'
        });
        res.end();
        return;
    }

    this._sendDefaultPage(res);
};

ServerHandler.prototype._sendDefaultPage = function (res) {
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=UTF-8'
    });
    var indexData = fs.readFileSync('index.html');

    res.end(indexData);
};

ServerHandler.prototype._sendError = function (res, err) {
    res.writeHead(err, {"Content-Type": "text/plain"});
    res.write(err + " " + http.STATUS_CODES[err] + "\n");
    res.end();
};

ServerHandler.prototype._sendFile = function (res, parent, path) {
    var self = this;
    var file = "files/" + path;
    if (parent) {
        file = "moduls/" + parent + "/" + file;
    }
    magic.detectFile(file, function (err, result) {
        fs.readFile(file, function (err, data) {
            if (!err) {
                res.writeHead(200, {
                    'Content-Type': result
                });
                res.end(data);
            } else {
                self._sendError(res, 404);
                console.log(err);
            }
        });
    });
};

ServerHandler.prototype._sendJavascript = function (res, modul, file) {
    var self = this;

    this.context.getService('compiler').getJs(modul, file + '.js', function (err, data) {
        if (!err) {
            res.writeHead(200, {
                'Content-Type': 'application/javascript; charset=utf-8'
            });
            res.end(data);
        } else {
            self._sendError(res, 404);
            console.log(err);
        }
    });
};
ServerHandler.prototype._sendCss = function (res, modul, file) {
    var self = this;
    this.context.getService('compiler').getLess(modul, file + '.css', function (err, data) {
        if (!err) {
            res.writeHead(200, {
                'Content-Type': 'text/css; charset=utf-8'
            });
            res.end(data);
        } else {
            self._sendError(res, 404);
            console.log(err);
        }
    });
};

ServerHandler.prototype._sendTranslation = function (res, modul) {
    var translation = this.context.getService('translator').getTranslation(modul, this.config.get('lang'));
    res.writeHead(200, {
        'Content-Type': 'application/javascript; charset=utf-8'
    });

    res.end("var _ = " + JSON.stringify(translation));
};

ServerHandler.prototype._friendlyPath = function (path) {
    return decodeURIComponent(path).replace(/\.+/g, '.').replace(/(?:^\/|\/$)/, '');
};

module.exports = ServerHandler;