define(function (require) {
    var NAMESPACE = "Form/Entity";
    var Synchronized = require("Base/Synchronized");
    var BasicRender = require("Kirino/Render/BasicRender");
    var OvaRender = require("Kirino/Render/OvaRender");
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
        "anidbEpisodeId": {
            type: Form.TYPE.NUMBER,
            label: 'anidbId'
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

    return class Ova extends require("Form/BoxEntityForm") {
        constructor(id) {
            super("ovaTitle", null, OvaRender.ICON, id, ITEMS, null);
            let THIS = this;
            this.callback = this._callback;
            KirinoSettings.getData().then((data) => {
                THIS.color = data.ova.color;
            });
        }

        _callback() {
            let end = function () {
                chrome.runtime.sendMessage({name: KirinoSettings.namespace + '.' + OvaRender.ID + '.render'}, null);
                $(".close").click();
            };
            if (this.adding) {
                var kirino = new Synchronized(KirinoSettings.namespace);
                kirino.set({
                    ova: Synchronized.arrayAdder(this.id)
                }).then(end);
            } else {
                end();
            }

        }
    }
});