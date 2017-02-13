define(function (require) {
    var NAMESPACE = "Background/Loops";
    var Data = require("Base/Data");
    var Synchronized = require("Base/Synchronized");
    var KirinoSettings = require("Kirino/Settings");

    var Episode = require("Kirino/Types/Episode");

    return class AEpisodeLoop extends require("Background/Loops/ALoop") {
        constructor() {
            super();
            this.kirino = new Synchronized(KirinoSettings.namespace);
        }

        get LOOP_NAME() {
            return null;
        }

        get DELAY() {
            return null;
        }

        get REFRESH_RATE_NAME() {
            return null;
        }

        get TYPE_NAME() {
            return null;
        }

        get THING_CLASS() {
            return null;
        }

        get PARSER_CLASS() {
            return null;
        }

        get ID_KEY() {
            return null;
        }

        start(ids, forced = false) {
            let THIS = this;
            let o = {};
            o[THIS.LOOP_NAME] = 0;
            Data.get(o, function (keys) {
                let last = keys[THIS.LOOP_NAME] ? keys[THIS.LOOP_NAME] : 0;
                let get = {
                    maxEpisodes: 2
                };
                get[THIS.TYPE_NAME] = [];
                get[THIS.REFRESH_RATE_NAME] = "00:00";
                THIS.kirino.get(get).then((kirino) => {
                    if (ids) {
                        THIS._getEpisodes(ids, kirino['maxEpisodes']);
                        return;
                    }
                    if (forced || AEpisodeLoop.TODAY - last > THIS._timeToMs(kirino[THIS.REFRESH_RATE_NAME])) {
                        THIS._getEpisodes(kirino[THIS.TYPE_NAME], kirino['maxEpisodes']);
                        o[THIS.LOOP_NAME] = AEpisodeLoop.TODAY;
                        Data.set(o);
                    }
                });
            });
        }

        _getEpisodes(ids, maxEpisodes) {
            let THIS = this;
            let TODAY = AEpisodeLoop.TODAY;
            THIS.THING_CLASS.getAll(ids).then((shows) => {
                let episodes = [];
                let data = {};
                for (let k in shows) {
                    episodes = episodes.concat(shows[k].episodes);
                    data[k] = {
                        aired: 0,
                        last: TODAY
                    };
                }
                Episode.getAll(episodes).then((episodes) => {
                    for (let i in episodes) {
                        let e = episodes[i];
                        if (e.date < TODAY) {
                            data[e.thing]['aired'] += 1;
                            data[e.thing]['last'] = e.date;
                        }
                    }
                    return data;
                }).then((data) => {
                    let k = 0;
                    for (let i in shows) {
                        let show = shows[i];
                        let getNew = maxEpisodes - data[i]['aired'];
                        let last = data[i]['last'];
                        if (getNew > 0) {
                            setTimeout(() => {
                                let add = [];
                                THIS.PARSER_CLASS.getData(show[THIS.ID_KEY]).then((data) => {
                                    for (let i in data.episodes) {
                                        let e = data.episodes[i];
                                        if (e && e.date && typeof e.date === 'object' && last < e.date.getTime()) {
                                            add.push(e);
                                            getNew -= 1;
                                            if (getNew <= 0)
                                                break;
                                        }
                                    }
                                    THIS._add(show, add);
                                });
                            }, THIS.DELAY * k++);
                        }
                    }
                });
            });
        }

        _add(ids) {

        }
    };
});