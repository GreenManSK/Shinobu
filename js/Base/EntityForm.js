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

        get _getDataObject() {
            return Synchronized;
        }

        _getData(items) {
            if (items && items.hasOwnProperty('id')) {
                let THIS = this;
                let object = new this._getDataObject(items['id']);
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
                for (let i in items) {
                    this.data[i] = items[i].default ? items[i].default : null;
                }
            }

            return Promise.resolve();
        }

        _harvestValues() {
            if (this.id) {
                let THIS = this;
                return super._harvestValues().then((values) => {
                    values.id = THIS.id;
                    return values;
                });
            } else {
                return super._harvestValues();
            }
        }

        _saveData(harvestedValues) {
            if (this.id) {
                let object = new this._getDataObject(this.id);
                return object.set(harvestedValues);
            } else {
                let THIS = this;
                return this._getDataObject.create().then((object) => {
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
                let object = this._getDataObject.create();
                let vals = null;
                object.then((object) => {
                    return new Promise((cb) => {
                        THIS._harvestValues().then((values) => {
                            vals = values;
                            object.set(values).then(cb());
                        });
                    }).then(() => {
                        Notifications.notify(_("formSubmitSuccess"), Notifications.Type.SUCCESS);
                        vals.id = object.id;
                        if (THIS.callback) {
                            THIS.callback(vals);
                        }
                    });
                });
            }
        }
    }
});