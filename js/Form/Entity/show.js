define(function (require) {
    var NAMESPACE = "Form/Entity";
    var Synchronized = require("Base/Synchronized");
    var BasicRender = require("Kirino/Render/BasicRender");
    var ShowRender = require("Kirino/Render/ShowRender");
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
        "nextEpisodeId": {
            type: Form.TYPE.TEXT,
            label: 'nextEpisodeId'
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

    return class Show extends require("Form/BoxEntityForm") {
        constructor(id) {
            super("showsTitle", null, ShowRender.ICON, id, ITEMS, null);
            let THIS = this;
            this.callback = this._callback;
            KirinoSettings.getData().then((data) => {
                THIS.color = data.show.color;
            });
        }

        _callback() {
            let end = function () {
                chrome.runtime.sendMessage({name: KirinoSettings.namespace + '.' + ShowRender.ID + '.render'}, null);
                $(".close").click();
            };
            if (this.adding) {
                var kirino = new Synchronized(KirinoSettings.namespace);
                kirino.set({
                    show: Synchronized.arrayAdder(this.id)
                }).then(end);
            } else {
                end();
            }

        }
    }
});
