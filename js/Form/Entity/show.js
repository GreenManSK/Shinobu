define(function (require) {
    var NAMESPACE = "Form/Entity";
    var ShowEntity = require("Kirino/Types/Show");
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

        get _getDataObject() {
            return ShowEntity;
        }

        _callback(values) {
            let end = function () {
                chrome.runtime.sendMessage({name: KirinoSettings.namespace + '.' + ShowRender.ID + '.render'}, null);
                $(".close").click();
            };
            if (this.adding) {
                var kirino = new this._getDataObject(KirinoSettings.namespace);
                kirino.set({
                    show: this._getDataObject.arrayAdder(values.id)
                }).then(end);
            } else {
                end();
            }

        }
    }
});
