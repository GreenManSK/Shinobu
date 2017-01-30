define(function (require) {
    var NAMESPACE = "Base";
    var Synchronized = require("Base/Synchronized");
    var Notifications = require("Base/Notifications");

    return class EntityForm extends require("Base/Form") {
        constructor(id, items, callback) {
            if (id)
                items.id = id;
            super(items, callback);
            this.id = id;
            this.adding = id ? false : true;
        }

        _getData(items) {
            if (items && items.hasOwnProperty('id')) {
                let THIS = this;
                let object = new Synchronized(items['id']);
                let get = {};
                delete items['id'];

                for (let i in items) {
                    get[i] = items[i].default ? items[i].default : null;
                }
                return new Promise((cb) => {
                    object.get(get).then((values) => {
                        THIS.data = values;
                        cb();
                    });
                });
            } else {
                this.data = {};
            }

            return Promise.resolve();
        }

        _saveData(harvestedValues) {
            if (this.id) {
                let object = new Synchronized(this.id);
                return object.set(harvestedValues);
            } else {
                let THIS = this;
                return Synchronized.create().then((object) => {
                    THIS.id = object.id;
                    return object.set(harvestedValues);
                });
            }
        }

        _submitHandle(e, THIS) {
            if (!THIS.adding) {
                super._submitHandle(e, THIS);
            } else {
                e.preventDefault();
                let set = THIS._getValues();
                let object = Synchronized.create();
                object.then((object) => {
                    object.set(set).then(() => {
                        Notifications.notify(_("formSubmitSuccess"), Notifications.Type.SUCCESS);
                        if (THIS.callback) {
                            THIS.callback(object);
                        }
                    });
                });
            }
        }
    }
});