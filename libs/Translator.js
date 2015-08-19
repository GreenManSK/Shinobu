var fs = require('fs');

var Translator = function (config, context) {
    if (!(this instanceof Translator))
        return new Translator(config, context);

    this.config = config;
    this.context = context;

    this.translations = {};
};

Translator.prototype.getTranslation = function (modul, lang) {
    if (!this.config.get('cache.translation')) {
        if (typeof this.translations[modul] === 'undefined') {
            this.translations[modul] = {};
        }
        if (typeof this.translations[modul][lang] === 'undefined') {
            this.translations[modul][lang] = this.loadTranslation(modul, lang);
        }

        return this.translations[modul][lang];
    } else {
        return this.loadTranslation(modul, lang);
    }
};

Translator.prototype.loadTranslation = function (modul, lang) {
    var file = "moduls/" + modul + "/lang/" + lang + ".json";
    var translation;
    if (fs.existsSync(file)) {
        translation = JSON.parse(fs.readFileSync(file).toString());
    } else {
        console.log(lang + ' translation for ' + modul + ' doesn\'t exist');

        if (fs.existsSync("moduls/" + modul + "/lang/")) {
            var dirs = fs.readdirSync("moduls/" + modul + "/lang/");
            if (dirs.length === 0) {
                console.log('There isn\'t any translation for ' + modul);
                translation = {};
            } else {
                translation = JSON.parse(fs.readFileSync("moduls/" + modul + "/lang/" + dirs[0]).toString());
            }
        } else {
            console.log('There isn\'t any translation for ' + modul);
            translation = {};
        }
    }

    translation = this.parse(translation);
    var mainTranslation = this.loadMainTranslation(lang);
    for (var i in mainTranslation) {
        if (typeof translation[i] === 'undefined')
            translation[i] = mainTranslation[i];
    }

    return translation;
};

Translator.prototype.loadMainTranslation = function (lang) {
    if (fs.existsSync('lang/' + lang + '.json')) {
        return JSON.parse(fs.readFileSync('lang/' + lang + '.json').toString());
    }
    return {};
};

Translator.prototype.parse = function (source, branch) {
    if (branch === undefined)
        branch = source;
    main: for (var i in branch) {
        if (typeof branch[i] === 'string') {
            if (branch[i].match(/^##/) !== null) {
                branch[i] = branch[i].replace(/^##/, '#');
            } else if (branch[i].match(/^#/) !== null) {
                var parts = branch[i].replace(/^#/, '').match(/([^.]+)/g);
                var s = source;

                for (var j in parts) {
                    if (typeof s[parts[j]] !== 'undefined') {
                        s = s[parts[j]];
                    } else {
                        branch[i] += ' is invalid link';
                        continue main;
                    }
                }
                branch[i] = s;
            }
        } else {
            branch[i] = this.parse(source, branch[i]);
        }
    }
    return branch;
};

module.exports = Translator;