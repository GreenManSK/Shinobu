define(function (require) {
    var NAMESPACE = "Form/Entity";
    var Synchronized = require("Base/Synchronized");
    var BasicRender = require("Kirino/Render/BasicRender");
    var MusicRender = require("Kirino/Render/MusicRender");
    var KirinoSettings = require("Kirino/Settings");
    var Form = require("Base/Form");

    var ITEMS = {
        "show": {
            type: Form.TYPE.TEXT,
            label: 'show',
            validators: [
                [Form.VALIDATION.REQUIERED, "needToFill"]
            ]
        },
        "type": {
            type: Form.TYPE.TEXT,
            label: 'type',
            validators: [
                [Form.VALIDATION.REQUIERED, "needToFill"]
            ]
        },
        "title": {
            type: Form.TYPE.TEXT,
            label: 'title'
        },
        "author": {
            type: Form.TYPE.TEXT,
            label: 'author'
        },
        "anisonId": {
            type: Form.TYPE.NUMBER,
            label: 'anisonId'
        },
        "vgmdbId": {
            type: Form.TYPE.NUMBER,
            label: 'vgmdbId'
        },
        "date": {
            type: Form.TYPE.DATE,
            label: 'date'
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

    return class Music extends require("Form/BoxEntityForm") {
        constructor(id) {
            super("musicTitle", null, MusicRender.ICON, id, ITEMS, null);
            let THIS = this;
            this.callback = this._callback;
            KirinoSettings.getData().then((data) => {
                THIS.color = data.music.color;
            });
        }

        _callback() {
            let end = function () {
                chrome.runtime.sendMessage({name: KirinoSettings.namespace + '.' + MusicRender.ID + '.render'}, null);
                $(".close").click();
            };
            if (this.adding) {
                var kirino = new Synchronized(KirinoSettings.namespace);
                kirino.set({
                    music: Synchronized.arrayAdder(this.id)
                }).then(end);
            } else {
                end();
            }

        }
    }
});
