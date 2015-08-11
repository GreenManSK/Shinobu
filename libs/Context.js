var Context = function (config) {
    if (!(this instanceof Context)) {
        return new Context(config);
    }
    this.config = config;
};

Context.prototype.services = {};
Context.prototype.libs = {};
Context.prototype.factories = {};

Context.prototype.addService = function (name, service, attrs) {
    if (typeof service === 'string') {
        if (attrs === undefined) {
            attrs = [];
        }
        attrs.unshift(this.config, this);
        this.services[name] = require("../" + service).apply(null, attrs);
    } else {
        this.services[name] = service;
    }
};

Context.prototype.getService = function (name) {
    if (typeof this.services[name] === 'undefined')
        throw "Service " + name + " doesn't exist.";
    return this.services[name];
};

Context.prototype.addLib = function (name, lib) {
    if (typeof lib === 'string') {
        this.libs[name] = require(lib);
    } else {
        this.libs[name] = lib;
    }
};

Context.prototype.getLib = function (name) {
    if (typeof this.libs[name] === 'undefined')
        throw "Lib " + name + " doesn't exist.";
    return this.libs[name];
};

Context.prototype.addFactory = function (name, path) {
    this.factories[name] = require("../" + path);
};

Context.prototype.createInstance = function (name, attrs) {
    if (typeof this.factories[name] === 'undefined')
        throw "Factory " + name + " doesn't exist.";
    if (attrs === undefined) {
        attrs = [];
    }
    attrs.unshift(this.config, this);
    return this.factories[name].apply(null, attrs);
};

module.exports = Context;