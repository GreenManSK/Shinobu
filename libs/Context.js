var Context = function (config) {
    if (!(this instanceof Context)) {
        return new Context(config);
    }
};

Context.prototype.services = {};
Context.prototype.factories = {};

Context.prototype.addService = function (name, path, attrs) {
    if (attrs === undefined) {
        attrs = [];
    }
    attrs.unshift(this.config, this);
    this.services[name] = require("../" + path).apply(null, attrs);
};

Context.prototype.getService = function (name) {
    if (typeof this.services[name] === 'undefined')
        throw "Service " + name + " doesn't exist.";
    return this.services[name];
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