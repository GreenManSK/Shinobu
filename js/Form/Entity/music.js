define(function (require) {
    var NAMESPACE = "Form/Entity";
    var MusicEntity = require("Kirino/Types/Music");
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
            label: 'anisonId',
            help: "http://anison.info/"
        },
        "anidbId": {
            type: Form.TYPE.NUMBER,
            label: 'anidbId',
            help: "http://anidb.net/perl-bin/animedb.pl?show=main"
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

        get _getDataObject() {
            return MusicEntity;
        }

        _callback(object) {
            let end = function () {
                chrome.runtime.sendMessage({name: KirinoSettings.namespace + '.' + MusicRender.ID + '.render'}, null);
                $(".close").click();
            };
            if (this.adding) {
                var kirino = new this._getDataObject(KirinoSettings.namespace);
                kirino.set({
                    music: this._getDataObject.arrayAdder(object.id)
                }).then(end);
            } else {
                end();
            }

        }
    }
});
