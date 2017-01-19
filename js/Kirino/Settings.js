var NAMESPACE = "Kirino";
define(function (require) {
    var Data = require("Base/Data");
    var BasicRender = require("Kirino/Render/BasicRender");

    var MusicRender = require("Kirino/Render/MusicRender");
    var OvaRender = require("Kirino/Render/OvaRender");
    var ShowRender = require("Kirino/Render/ShowRender");
    var AnimeRender = require("Kirino/Render/AnimeRender");

    var defaultSettings = {
        left: ['anime', 'show'],
        right: ['music', 'ova'],
        'anime': {
            color: BasicRender.Color.RED
        },
        'show': {
            color: BasicRender.Color.GREEN
        },
        'music': {
            color: BasicRender.Color.BLUE
        },
        'ova': {
            color: BasicRender.Color.PINK
        }
    };

    class Settings {
        constructor() {
            this.renders = [];
            this.updatePromise = new Promise((cb) => cb());
        }

        prepare() {
            let THIS = this;
            let get = {};
            return new Promise((cb) => {
                get[THIS.settings] = defaultSettings;
                Data.get(get, (items) => {
                    let left = items[THIS.settings]['left'];
                    for (let k in left) {
                        this.renders.push(THIS._create(
                            left[k],
                            BasicRender.Column.FIRST,
                            items[THIS.settings][left[k]]['color']
                        ));
                    }


                    let right = items[THIS.settings]['right'];
                    for (let k in right) {
                        this.renders.push(THIS._create(
                            right[k],
                            BasicRender.Column.SECOND,
                            items[THIS.settings][right[k]]['color']
                        ));
                    }
                    cb();
                });
            });
        }

        get settings() {
            return Settings.namespace + ".settings";
        }

        _create(name, column, color) {
            let c;
            switch (name) {
                case 'anime':
                    c = AnimeRender;
                    break;
                case 'show':
                    c = ShowRender;
                    break;
                case 'music':
                    c = MusicRender;
                    break;
                case 'ova':
                    c = OvaRender;
                    break;
            }
            return new c(color, column, this);
        }

        start() {
            this.prepare().then(() => {
                for (let k in this.renders) {
                    this.renders[k].render();
                }
            });
        }

        updateColor(name, color) {
            var THIS = this;
            this.updatePromise = this.updatePromise.then(() => {
                return new Promise((cb) => {
                    let get = {};
                    get[THIS.settings] = defaultSettings;
                    Data.get(get, (items) => {
                        items[this.settings][name]['color'] = color;
                        Data.set(items, () => {
                            console.log(name + " " + color);
                            cb();
                        })
                    });
                });
            });
        }

        static get namespace() {
            return NAMESPACE;
        }
    }
    return new Settings();
});