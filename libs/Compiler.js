var fs = require("fs");
var less = require("less");
var Compiler = function (config, context) {
    if (!(this instanceof Compiler))
        return new Compiler(config, context);
    this.config = config;
    this.context = context;

    this.modulDir = 'moduls';

    this.tmpJsDir = 'js';
    this.tmpLessDir = 'less';
    this.tmpTemplatesDir = 'templates';

    this.tmpPath = config.get('cache.tmpDir') + '/';
    this.moduls = [];
};
Compiler.prototype.compileAll = function (cb) {
    var self = this;
    var cbCalls = 0;
    cbCalls += self.config.get('cache.less') ? 1 : 0;
    cbCalls += self.config.get('cache.templates') ? 1 : 0;
    cbCalls += self.config.get('cache.js') ? 1 : 0;
    var upCallback = function () {
        if (cbCalls === 0)
            cb();
        else
            cbCalls -= 1;
    };
    var start = function () {
        self.compileAllTemplates(function () {
            if (self.config.get('cache.js'))
                self.compileAllJs(upCallback);
            upCallback();
        });
        if (self.config.get('cache.less'))
            self.compileAllLess(upCallback);
        upCallback();
    };
    this.createModulDirs(start);
};
Compiler.prototype.createModulDirs = function (cb) {
    this.moduls = fs.readdirSync(this.modulDir);
    for (var i in this.moduls) {
        var stats = fs.statSync(this.modulDir + '/' + this.moduls[i]);
        if (!stats.isDirectory()) {
            delete this.moduls[i];
            continue;
        }
        if (!fs.existsSync(this.tmpPath + this.moduls[i]))
            fs.mkdirSync(this.tmpPath + this.moduls[i]);
    }
    cb();
};
/* Less Compiler */
Compiler.prototype.compileAllLess = function (cb) {
    var self = this;

    console.log('Compiling less...');
    var dirs = [];
    for (var i in this.moduls) {
        dirs.push(this.moduls[i] + '/' + this.tmpLessDir);
    }

    var cbCalls = dirs.length;
    var upCallback = function () {
        cbCalls -= 1;
        if (cbCalls >= 0) {
            console.log('Compiling less completed!');
            cb();
        }
    };

    for (var d in dirs) {
        this.removeDirSync(this.tmpPath + dirs[d], function () {
            var dir = this.toString();
            if (!fs.existsSync(self.tmpPath + dir))
                fs.mkdirSync(self.tmpPath + dir);
            var files = fs.readdirSync(self.modulDir + '/' + dir);
            var filesCount = 0;
            for (var i in files) {
                var file = files[i];
                self.compileLess(dir.replace(/\/?less$/i, ''), file, function (err, css) {
                    var file = this.toString();
                    if (!err) {
                        fs.writeFile(self.tmpPath + dir + '/' + file.replace(/\.less$/i, '.css'), css, function (err) {
                            if (err) {
                                console.log('Coudln\'t save compiled ' + file);
                                console.log(err);
                            }
                        });
                    }
                    if (++filesCount === files.length) {
                        upCallback();
                    }
                }.bind(file));
            }
        }.bind(dirs[d]));
    }
};

Compiler.prototype.compileLess = function (modul, file, cb) {
    if (file.match(/\.less$/) === null) {
        console.log(file + ' is invalid less file name');
        cb(true);
        return;
    }

    var path = this.tmpLessDir;
    if (modul) {
        path = this.modulDir + '/' + modul + '/' + path;
    }

    if (!fs.existsSync(path + "/" + file)) {
        cb(path + "/" + file + ' not exists');
        return;
    }
    var data = fs.readFileSync(path + '/' + file, "utf8");
    less.render(data, {
        compress: this.config.get('minify.less'),
        paths: [path]
    }, function (err, out) {
        if (err) {
            console.log('Coudln\'t save compiled ' + file);
            console.log(err);
            cb(true);
        } else {
            cb(false, out.css);
        }
    });
};
Compiler.prototype.getLess = function (modul, file, cb) {
    if (this.config.get('cache.less')) {
        var path = this.tmpPath + '/';
        if (modul) {
            path += modul + '/';
        }
        path += this.tmpLessDir + '/' + file;
        fs.readFile(path, function (err, out) {
            if (err)
                cb(err);
            else
                cb(false, out.toString());
        });
    } else {
        this.compileLess(modul, file.replace(/.css$/, '.less'), cb);
    }
};
/* Templates */
Compiler.prototype.compileAllTemplates = function (cb) {
    console.log('Compiling templates...');

    var cbCalls = this.moduls.length;
    var upCallback = function () {
        cbCalls -= 1;
        if (cbCalls >= 0) {
            console.log('Compiling templates completed!');
            cb();
        }
    };

    for (var d in this.moduls) {
        var string = this.generateTemplatesJs(this.moduls[d]);
        if (this.config.get('cache.templates')) {
            fs.writeFile(this.tmpPath + '/' + this.moduls[d] + '/templates.js', string, function (err) {
                if (err) {
                    console.log('Coudln\'t compile templates.js');
                    console.log(err);
                }
                upCallback();
            });
        }
    }
};

Compiler.prototype.generateTemplatesJs = function (modul) {
    var templates = this.compileTemplatesIn(modul, this.modulDir + '/' + modul + '/' + this.tmpTemplatesDir);

    var string = "";
    for (var name in templates) {
        string += "dust.loadSource(" + templates[name].substring(0, templates[name].length - 1) + ");\n";
    }
    return string;
};

Compiler.prototype.compileTemplatesIn = function (modul, dir) {
    var templates = {};
    var files = fs.readdirSync(dir);

    for (var i in files) {
        if (files[i].match(/\.html$/) !== null) {
            var name = (dir + "/" + files[i]).replace(this.modulDir + '/' + modul + '/' + this.tmpTemplatesDir + '/', '').replace(/\.html$/i, '').replace(/\//g, '.');
            var templateName = this.createTemplateName(modul, name);
            templates[templateName] = this.compileTemplate(modul, name);
        } else {
            var subTemplates = this.compileTemplatesIn(modul, dir + "/" + files[i]);
            for (var i in subTemplates)
                templates[i] = subTemplates[i];
        }
    }

    return templates;
};

Compiler.prototype.compileTemplate = function (modul, name) {
    var file = this._normalizeTemplateName(name);

    var path = this.modulDir + '/' + modul + '/' + this.tmpTemplatesDir + '/' + file;

    if (!fs.existsSync(path)) {
        console.log(path + ' not exists');
        return;
    }

    var data = fs.readFileSync(path, "utf8");
    var compiled = this.context.getLib('dust').compile(data, this.createTemplateName(modul, name));
    this.context.getLib('dust').loadSource(compiled);

    return compiled;
};

Compiler.prototype.getTemplate = function (modul, name, data, cb) {
    if (!name)
        cb(false, '');

    var templateName = this.createTemplateName(modul, name);

    if (!this.config.get('cache.templates') || this.templateLoaded(templateName)) {
        this.compileTemplate(modul, name);
    }

    this.context.getLib('dust').render(templateName, data, cb);
};

Compiler.prototype.getTemplateNoNeed = function (modul, name, data, cb) {
    if (!this.config.get('cache.templates') || this.context.getLib('dust').cache[name]) {
        this.getTemplate(modul, name, data, cb);
    } else {
        cb(false, '');
    }
};

/* Javascipt */
Compiler.prototype.compileAllJs = function (cb) {
    var self = this;
    console.log('Compiling javascript...');
    var dirs = [this.tmpJsDir];
    for (var i in this.moduls) {
        dirs.push(this.moduls[i] + '/' + this.tmpJsDir);
    }

    var cbCalls = dirs.length;
    var upCallback = function () {
        cbCalls -= 1;
        if (cbCalls >= 0) {
            console.log('Compiling javascript completed!');
            cb();
        }
    };
    for (var d in dirs) {
        this.removeDirSync(this.tmpPath + dirs[d], function () {
            var dir = this.toString();
            if (!fs.existsSync(self.tmpPath + dir))
                fs.mkdirSync(self.tmpPath + dir);

            var files = fs.readdirSync((dir !== self.tmpJsDir ? self.modulDir + '/' : '') + dir + '/front');
            var filesCount = 0;
            for (var i in files) {
                var file = files[i];
                self.compileJs(dir.replace(/\/?js$/i, ''), file, function (err, js) {
                    var file = this.toString();
                    if (!err) {
                        fs.writeFile(self.tmpPath + dir + '/' + file, js, function (err) {
                            if (err) {
                                console.log('Coudln\'t save compiled ' + file);
                                console.log(err);
                            }
                        });
                    }
                    if (++filesCount === files.length) {
                        upCallback();
                    }
                    if (err) {
                        console.log('Coudln\'t save compiled ' + file);
                        console.log(err);
                    }
                }.bind(file));
            }
        }.bind(dirs[d]));
    }
};
Compiler.prototype.compileJs = function (modul, file, cb) {
    var self = this;
    var forntFilePath = this.tmpJsDir + "/front/" + file;
    var backPath = this.tmpJsDir + '/back/';
    if (modul) {
        forntFilePath = this.modulDir + '/' + modul + '/' + forntFilePath;
        backPath = this.modulDir + '/' + modul + '/' + backPath;
    }

    if (!fs.existsSync(forntFilePath)) {
        console.log(forntFilePath + ' not exists');
        cb(true);
        return;
    }
    var content = fs.readFileSync(forntFilePath, "utf8");
    content = content.replace(/^#include (.*)$/igm, function (replace) {
        var file = replace.replace(/^#include /i, '');
        if (file === 'templates.js') {
            if (!self.config.get('cache.templates')) {
                return self.generateTemplatesJs(modul);
            } else {
                return fs.readFileSync(self.tmpPath + '/' + modul + '/templates.js', 'utf8');
            }
        } else {
            var content = "";
            if (!fs.existsSync(backPath + file)) {
                console.log(backPath + ' not exists');
            } else {
                content = fs.readFileSync(backPath + file);
            }
            return content;
        }
    });
    cb(false, content);
};
Compiler.prototype.getJs = function (modul, file, cb) {
    if (this.config.get('cache.js')) {
        var path = this.tmpPath + '/';
        if (modul) {
            path += modul + '/';
        }
        path += this.tmpJsDir + '/' + file;
        fs.readFile(path, function (err, out) {
            if (err)
                cb(err);
            else
                cb(false, out.toString());
        });
    } else {
        this.compileJs(modul, file, cb);
    }
};
/* Helpers */
Compiler.prototype.removeDirSync = function (dir, callback) {
    /** @todo: Implement */
    callback();
};
Compiler.prototype.templateLoaded = function (name) {
    return typeof this.context.dust.cache[name] === "undefined";
};
Compiler.prototype._normalizeTemplateName = function (name) {
    return name.replace(/\./g, '/') + '.html';
};
Compiler.prototype.createTemplateName = function (modul, name) {
    return modul.toLowerCase() + '.' + name;
};
module.exports = Compiler;
