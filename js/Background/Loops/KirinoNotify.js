define(function (require) {
    var NAMESPACE = "Background/Loops";
    var Synchronized = require("Base/Synchronized");
    var KirinoSettings = require("Kirino/Settings");

    var Anime = require("Kirino/Types/Anime");
    var Show = require("Kirino/Types/Show");
    var OVA = require("Kirino/Types/OVA");
    var Music = require("Kirino/Types/Music");
    var Episode = require("Kirino/Types/Episode");

    let DEFAULT_ICON = "icons/kirino/128.png";

    return class KirinoNotify {
        static get TODAY() {
            var d = new Date();
            d.setHours(23);
            d.setMinutes(59);
            d.setSeconds(59);
            d.setMilliseconds(59);
            return d.getTime();
        }

        constructor() {
            this.kirino = new Synchronized(KirinoSettings.namespace);
        }

        start() {
            let THIS = this;
            this.kirino.get({
                "anime": [],
                "music": [],
                "ova": [],
                "show": []
            }).then((kirino) => {
                THIS._notifyMusic(kirino['music']);
                THIS._notifyOVA(kirino['ova']);
                THIS._notifyEpisodic(Show, kirino['show'], "showsTitle");
                THIS._notifyEpisodic(Anime, kirino['anime'], "animeTitle");
            });
        }

        _notifyEpisodic(entityClass, ids, title) {
            let THIS = this;
            let TODAY = KirinoNotify.TODAY;
            entityClass.getAll(ids).then((elements) => {
                let episodes = [];
                for (let k in elements) {
                    episodes = episodes.concat(elements[k].episodes);
                }
                Episode.getAll(episodes).then((episodes) => {
                    for (let i in episodes) {
                        let e = episodes[i];
                        if (!e.notified && e.date && TODAY >= e.date) {
                            THIS._notify(_(title) + ": " + elements[e.thing].name + " " + (
                                    entityClass.hasOwnProperty("decodeEpisodeNumber") ? entityClass.decodeEpisodeNumber(e.number) : e.number
                                ));
                            (new Episode(e.id)).set("notified", true);
                        }
                    }
                });
            });
        }

        _notifyOVA(ids) {
            let THIS = this;
            let TODAY = KirinoNotify.TODAY;
            OVA.getAll(ids).then((elements) => {
                for (let i in elements) {
                    let e = elements[i];
                    if (!e.notified && e.date && TODAY >= e.date) {
                        THIS._notify(_("ovaTitle") + ": " + e.name);
                        (new OVA(e.id)).set("notified", true);
                    }
                }
            });
        }

        _notifyMusic(ids) {
            let THIS = this;
            let TODAY = KirinoNotify.TODAY;
            Music.getAll(ids).then((elements) => {
                for (let i in elements) {
                    let e = elements[i];
                    if (!e.notified && e.date && TODAY >= e.date) {
                        THIS._notify(_("musicTitle") + ": " + e.show + " - " + e.type);
                        (new Music(e.id)).set("notified", true);
                    }
                }
            });
        }

        _notify(text, link = "kirino.html", icon = null) {
            chrome.runtime.sendMessage({
                name: "extensionNotifications.add",
                "text": _(text),
                "img": icon === null,
                "icon": icon !== null ? icon : DEFAULT_ICON,
                "link": link
            }, null);
        }
    }
});