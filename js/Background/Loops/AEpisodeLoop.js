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
                        THIS._getNewEpisodes(ids, kirino['maxEpisodes']);
                        return;
                    }
                    if (forced || AEpisodeLoop.TODAY - last > THIS._timeToMs(kirino[THIS.REFRESH_RATE_NAME])) {
                        THIS._getNewEpisodes(kirino[THIS.TYPE_NAME], kirino['maxEpisodes']);
                        o[THIS.LOOP_NAME] = Data.timestamp();
                        Data.set(o);
                    }
                });
            });
        }

        _getNewEpisodes(ids, maxEpisodes) {
            let THIS = this;
            THIS._getShowsData(ids).then((object) => {
                let data = object.data;
                let shows = object.shows;
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
                                    if (e && show.episodes.indexOf(e.id) !== -1 && e.date && typeof e.date === 'object' && last < THIS._normalizeTimestamp(e.date)) {
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
        }

        getEpisodesFromDate(ids, date, count) {
            let THIS = this;
            date = THIS._normalizeTimestamp(date);
            THIS._getShowsData(ids).then((object) => {
                let data = object.data;
                let shows = object.shows;
                let k = 0;
                for (let i in shows) {
                    let show = shows[i];
                    let last = data[i]['last'];
                    setTimeout(() => {
                        let add = [];
                        THIS.PARSER_CLASS.getData(show[THIS.ID_KEY]).then((data) => {
                            let need = count;
                            for (let i in data.episodes) {
                                let e = data.episodes[i];
                                if (e && show.episodes.indexOf(e.id) !== -1 && e.date && typeof e.date === 'object' && date < THIS._normalizeTimestamp(e.date)) {
                                    add.push(e);
                                    need -= 1;
                                    if (need <= 0)
                                        break;
                                }
                            }
                            THIS._add(show, add);
                        });
                    }, THIS.DELAY * k++);
                }
            });
        }

        getEpisodesFromNumber(ids, number, count) {
            let THIS = this;
            THIS._getShowsData(ids).then((object) => {
                let data = object.data;
                let shows = object.shows;
                let k = 0;
                for (let i in shows) {
                    let show = shows[i];
                    let last = data[i]['last'];
                    setTimeout(() => {
                        let add = [];
                        THIS.PARSER_CLASS.getData(show[THIS.ID_KEY]).then((data) => {
                            let need = count;
                            for (let i in data.episodes) {
                                let e = data.episodes[i];
                                let eNum = THIS._parseEpisodeNumber(e);
                                if (e && show.episodes.indexOf(e.id) !== -1 && eNum && eNum > number) {
                                    add.push(e);
                                    need -= 1;
                                    if (need <= 0)
                                        break;
                                }
                            }
                            THIS._add(show, add);
                        });
                    }, THIS.DELAY * k++);
                }
            });
        }

        _parseEpisodeNumber(episode) {
            return episode.number;
        }

        _normalizeTimestamp(date) {
            let d;
            if (date instanceof  Date) {
                d = date;
            } else {
                d = new Date(date);
            }
            d.setHours(23);
            d.setMinutes(59);
            d.setSeconds(59);
            d.setMilliseconds(59);
            return d.getTime();
        }

        _getShowsData(ids) {
            let THIS = this;
            let TODAY = AEpisodeLoop.TODAY;
            let _shows = null;
            let _data = null;
            return THIS.THING_CLASS.getAll(ids).then((shows) => {
                _shows = shows;
                let episodes = [];
                let data = {};
                for (let k in shows) {
                    episodes = episodes.concat(shows[k].episodes);
                    data[k] = {
                        aired: 0,
                        last: TODAY
                    };
                }
                _data = data;
                return Episode.getAll(episodes);
            }).then((episodes) => {
                let data = _data;
                for (let i in episodes) {
                    let e = episodes[i];
                    if (e.date < TODAY) {
                        data[e.thing]['aired'] += 1;
                        let normalDate = THIS._normalizeTimestamp(e.date);
                        data[e.thing]['last'] = Math.max(data[e.thing]['last'], normalDate);
                    }
                }
                return {
                    data: data,
                    shows: _shows
                };
            });
        }

        _add(ids) {

        }
    };
});