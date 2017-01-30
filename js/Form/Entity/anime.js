define(function (require) {
    var NAMESPACE = "Form/Entity";
    var Synchronized = require("Base/Synchronized");
    var BasicRender = require("Kirino/Render/BasicRender");
    var AnimeRender = require("Kirino/Render/AnimeRender");
    var KirinoSettings = require("Kirino/Settings");
    var Form = require("Base/Form");

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
            ]
        },
        "searchText": {
            type: Form.TYPE.TEXT,
            label: 'searchText'
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

        _callback() {
            let end = function () {
                chrome.runtime.sendMessage({name: KirinoSettings.namespace + '.' + AnimeRender.ID + '.render'}, null);
                $(".close").click();
            };
            if (this.adding) {
                var kirino = new Synchronized(KirinoSettings.namespace);
                kirino.set({
                    anime: Synchronized.arrayAdder(this.id)
                }).then(end);
            } else {
                end();
            }

        }
    }
});
