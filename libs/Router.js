var Router = function () {
    if (!(this instanceof Router)) {
        return new Router();
    }

    this.routes = [];
    this.staticRoutes = [];

    this.regex = null;
    this.data = null;

    this.linksData = [];
};

Router.prototype.addRoute = function (route, handler) {
    handler = this._explodeHandler(handler);

    if (route.search(/<|>/) === -1) {
        this.staticRoutes[route] = handler;
    } else {
        var regex = '', varNames = [], varNeed = {}, variable = {
            modul: false,
            presenter: false,
            action: false
        };

        var self = this;
        regex = this.regexEncode(route).replace(/\[(.*?)\]/g, function (match, p1) {
            var matches = p1.match(/<(.*?)>/g);
            for (var i = 0; i < matches.length; i++) {
                varNeed[matches[i].replace(/<|>/g, '')] = false;
            }

            return '(?:' + p1 + ')?';
        }).replace(/(?:<.*?>)/g, function (group) {
            group = group.replace(/<|>/g, '');
            var parts = group.match(/([^\:]*)\:?(.*)/);

            if (varNeed[parts[1]] !== false)
                varNeed[parts[1]] = true;

            varNames.push(parts[1]);
            if (parts[1] === 'modul') {
                variable.modul = true;
            } else if (parts[1] === 'presenter') {
                variable.presenter = true;
            } else if (parts[1] === 'action') {
                variable.action = true;
            }

            return '(' + (parts[2] === '' ? '.*?' : self.regexDecode(parts[2])) + ')';
        });

        this.routes.push({
            regex: regex,
            varNames: varNames,
            handler: handler
        });

        delete varNeed.modul;
        delete varNeed.presenter;
        delete varNeed.action;
        this.linksData.push({
            route: route,
            modul: this.toUrlCase(handler.modul),
            presenter: this.toUrlCase(handler.presenter),
            action: this.toUrlCase(handler.action),
            varNeed: varNeed,
            variable: variable
        });

        if (this.regex !== null)
            this.recreateRegex();
    }
};

Router.prototype.recreateRegex = function () {
    var data = {}, regex = '^(?:';

    var last = 1;
    for (var i = this.routes.length - 1; i >= 0; i--) {
        regex += this.routes[i].regex + (i !== 0 ? '|' : '');
        data[last] = i;
        last += this.routes[i].varNames.length;
    }

    regex += ')$';

    this.regex = new RegExp(regex, 'i');
    this.data = data;
};

Router.prototype.dispatch = function (uri) {
    if (this.regex === null)
        this.recreateRegex();

    if (typeof this.staticRoutes[uri] !== 'undefined') {
        return {
            defaultHandler: this.staticRoutes[uri],
            handler: this.staticRoutes[uri],
            vars: []
        };
    }

    var matches = uri.match(this.regex);
    if (matches === null)
        return false;

    var i = 1;
    for (; matches[i] === undefined && i < matches.length; ++i)
        ;

    var key = this.data[i];

    for (; key === undefined; ) {
        i--;
        key = this.data[i];
    }

    var handler = {
        modul: this.routes[key].handler.modul,
        presenter: this.routes[key].handler.presenter,
        action: this.routes[key].handler.action
    }, varNames = this.routes[key].varNames, defaultHandler = this.routes[key].handler;

    var vars = {};
    for (var key in varNames) {
        vars[varNames[key]] = matches[i] ? decodeURIComponent(matches[i]) : '';
        i++;
    }

    if (vars.modul) {
        handler.modul = this.fromUrlCase(vars.modul.replace(/\.js$/i, '').replace(/^[a-z]/i, function ($1) {
            return $1.toUpperCase( );
        }));
        delete vars.modul;
    }

    if (vars.presenter) {
        handler.presenter = this.fromUrlCase(vars.presenter.replace(/\.js$/i, '').replace(/^[a-z]/i, function ($1) {
            return $1.toUpperCase( );
        }));
        delete vars.presenter;
    }

    if (vars.action) {
        handler.action = this.fromUrlCase(vars.action);
        delete vars.action;
    }

    return {
        defaultHandler: defaultHandler,
        handler: handler,
        vars: vars
    };
};

Router.prototype.createLink = function (handler, vars) {
    handler = this._explodeHandler(handler);
    handler.modul = this.toUrlCase(handler.modul);
    handler.presenter = this.toUrlCase(handler.presenter);
    handler.action = this.toUrlCase(handler.action);

    if (typeof vars === "undefined")
        vars = {};

    for (var i = this.linksData.length - 1; i >= 0; i--) {
        var route = this.linksData[i];
        if (handler.modul === route.modul || route.variable.modul) {
            if (handler.presenter === route.presenter || route.variable.presenter) {
                if (handler.action === route.action || route.variable.action) {
                    for (var j in route.varNeed) {
                        if (route.varNeed[j] === true && typeof vars[j] === "undefined")
                            continue;
                    }

                    var link = route.route;
                    if (route.variable.modul) {
                        link = link.replace('<modul>', encodeURIComponent(handler.modul));
                    }
                    if (route.variable.presenter) {
                        link = link.replace('<presenter>', encodeURIComponent(handler.presenter));
                    }
                    if (route.variable.action) {
                        link = link.replace('<action>', encodeURIComponent(handler.action));
                    }

                    var query = '';
                    for (var j in vars) {
                        if (link.match('<' + j + '>') !== null) {
                            link = link.replace('<' + j + '>', encodeURIComponent(vars[j]));
                        } else {
                            query += (query !== '' ? '&' : '') + encodeURIComponent(j) + '=' + encodeURIComponent(vars[j]);
                        }
                    }

                    if (query !== '')
                        link = link + '?' + query;

                    return link.replace(/\[(.*?)<(.*?)>(.*?)\]/g, '').replace(/\[|\]/g, '');
                }
            }
        }
    }

    return null;
};

Router.prototype._explodeHandler = function (handler) {
    if (typeof handler === 'string' || handler instanceof String) {
        var parts = handler.match(/^([^:]*):([^:]*):(.*)$/);
        handler = {
            modul: parts[1],
            presenter: parts[2] === '' ? 'Default' : parts[2],
            action: parts[3] === '' ? 'default' : parts[3]
        };
    }
    return handler;
};

Router.prototype.toUrlCase = function (str) {
    return str.replace(/[A-Z]/g, function (m) {
        return '-' + m.toLowerCase();
    }).replace(/^-/, '');
};

Router.prototype.fromUrlCase = function (str) {
    return str.replace(/-([a-z])/g, function (m, p1) {
        return p1.toUpperCase();
    });
};

Router.prototype.regexEncode = function (regex) {
    return regex.replace(/([\/\\\^\$\*\+\?\.\(\)\{\}])/g, '\\$1');
};

Router.prototype.regexDecode = function (regex) {
    return regex.replace(/\\(\\)?/g, '$1');
};

module.exports = Router;