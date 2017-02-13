define(function (require) {
    var NAMESPACE = "Form/Entity";
    var AnimeEntity = require("Kirino/Types/Anime");
    var BasicRender = require("Kirino/Render/BasicRender");
    var AnimeRender = require("Kirino/Render/AnimeRender");
    var KirinoSettings = require("Kirino/Settings");
    var Form = require("Base/Form");
    let BaseParser = require("Parsers/BaseParser");
    let AnidbAnime = require("Parsers/AnidbAnime");

    var ITEMS = {
        "name": {
            type: Form.TYPE.TEXT,
            label: 'title',
            validators: [
                [Form.VALIDATION.REQUIERED, "needToFill"]
            ]
        },
        "anidbId": {
            type: Form.TYPE.NUMBER,
            label: 'anidbId',
            validators: [
                [Form.VALIDATION.REQUIERED, "needToFill"]
            ],
            help: "http://anidb.net/perl-bin/animedb.pl?show=main"
        },
        "searchText": {
            type: Form.TYPE.TEXT,
            label: 'searchText',
            help: "searchTextHelp"
        },
        "submit": {
            type: Form.TYPE.SUBMIT,
            label: "save"
        }
    };

    return class Anime extends require("Form/BoxEntityForm") {
        constructor(id) {
            super("animeTitle", null, AnimeRender.ICON, id, ITEMS, null);
            let THIS = this;
            this.callback = this._callback;
            KirinoSettings.getData().then((data) => {
                THIS.color = data.anime.color;
            });
        }

        get _getDataObject() {
            return AnimeEntity;
        }

        _callback(values) {
            let end = function () {
                chrome.runtime.sendMessage({name: KirinoSettings.namespace + '.' + AnimeRender.ID + '.render'}, null);
                $(".close").click();
            };
            if (this.adding) {
                var kirino = new this._getDataObject(KirinoSettings.namespace);
                kirino.set({
                    anime: this._getDataObject.arrayAdder(values.id)
                }).then(() => {
                    chrome.runtime.sendMessage({
                        name: "kirino.anidb.anime",
                        "forced": true,
                        "ids": [values.id]
                    }, null);
                }).then(end);
            } else {
                end();
            }

        }
    }
});
