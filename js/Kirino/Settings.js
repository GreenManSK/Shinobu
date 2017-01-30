define(function (require) {
    var NAMESPACE = "Kirino";

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

        getData() {
            let THIS = this;
            let get = {};
            return new Promise((cb) => {
                get[THIS.settings] = defaultSettings;
                Data.get(get, (items) => {
                    cb(items[THIS.settings])
                })
            });
        }

        prepare() {
            let THIS = this;
            return this.getData().then((items) => {
                let left = items['left'];
                for (let k in left) {
                    this.renders.push(THIS._create(
                        left[k],
                        BasicRender.Column.FIRST,
                        items[left[k]]['color']
                    ));
                }


                let right = items['right'];
                for (let k in right) {
                    this.renders.push(THIS._create(
                        right[k],
                        BasicRender.Column.SECOND,
                        items[right[k]]['color']
                    ));
                }
                return;
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
            this._update((items, cb) => {
                items[this.settings][name]['color'] = color;
                Data.set(items, () => {
                    cb();
                });
            });
        }

        updatePlace(name, direction) {
            this._update((items, cb) => {
                let position = items[this.settings]['left'].indexOf(name) !== -1 ? 'left' : 'right';
                let index = items[this.settings][position].indexOf(name);
                if (direction == 'up' || direction == 'down') {
                    let change = index + (direction == 'up' ? -1 : 1);
                    if (change >= 0 && change < items[this.settings][position].length) {
                        items[this.settings][position][index] = items[this.settings][position][change];
                        items[this.settings][position][change] = name;
                    }
                } else if (position != direction) {
                    items[this.settings][position].splice(index, 1);
                    items[this.settings][direction].push(name);
                }
                Data.set(items, () => {
                    cb();
                });
            });
        }

        _update(cb) {
            var THIS = this;
            this.updatePromise = this.updatePromise.then(() => {
                return new Promise((promiseCb) => {
                    let get = {};
                    get[THIS.settings] = defaultSettings;
                    Data.get(get, (items) => {
                        cb(items, promiseCb);
                    });
                });
            });
        }

        static get namespace() {
            return NAMESPACE;
        }

        get namespace() {
            return Settings.namespace;
        }
    }
    return new Settings();
});