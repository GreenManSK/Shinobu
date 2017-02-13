var NAMESPACE = "Base";

define(function (require) {
    var Data = require("Base/Data");

    return class Synchronized {
        /**
         * Creates object from provided ID in database
         * @param id
         */
        constructor(id) {
            this.id = id;
            this._setPromies = new Promise((cb) => cb());
        }

        set id(id) {
            this._id = id;
            this.keyRegEx = new RegExp("^" + this._id + "#", "i");
        }

        get id() {
            return this._id;
        }

        /**
         * Return list of properties of object
         * @return {Array}
         */
        static attributes() {
            return [];
        }

        /**
         * Creates new object
         * @returns {Promise}
         */
        static create() {
            var obj = new this;
            return new Promise(function (cb) {
                Data.storage.get({
                    "_itterator": 0
                }, function (items) {
                    obj.id = "#" + (items["_itterator"] + 1) + "#" + Date.now().valueOf();
                    var set = {
                        "_itterator": items["_itterator"] + 1
                    };
                    set[obj.id] = Data.timestamp();
                    Data.storage.set(set, function () {
                        cb(obj);
                    });
                });
            });
        }

        /**
         * Return value of all atributes by provided ids
         * @param {string|Array} id
         * @return {Promise}
         */
        static getAll(id) {
            let THIS = this;
            return new Promise((result) => {
                let ids = Array.isArray(id) ? id : [id];

                let get = [];
                let attrs = THIS.attributes();

                let objs = {};

                for (let id in ids) {
                    objs[ids[id]] = new THIS(ids[id]);
                    for (let attr in attrs) {
                        get.push(objs[ids[id]]._getStorageKey(attrs[attr]));
                    }
                }
                Data.storage.get(get, function (items) {
                    var final = {};
                    for (let id in objs) {
                        final[id] = {
                            id: id,
                            class: THIS
                        };
                        for (let attr in attrs) {
                            final[id][attrs[attr]] = items[objs[id]._getStorageKey(attrs[attr])];
                            final[id][attrs[attr]] = final[id][attrs[attr]] ? final[id][attrs[attr]]['val'] : final[id][attrs[attr]];
                        }
                    }
                    result(Array.isArray(id) ? final : final[id]);
                });
            });
        }

        /**
         * Set key to provided value. Key can be dictionary with provided values.
         * If value is function, then it will be applied on actual value.
         * @param {string|object} key
         * @param {object|null} val
         * @returns {Promise}
         */
        set(key, val) {
            var THIS = this;
            return new Promise((result) => {
                if (typeof val !== 'undefined') {
                    let old = key;
                    key = {};
                    key[old] = val;
                }
                let fun = false;
                for (let i in key) {
                    if (typeof key[i] === 'function') {
                        fun = true;
                        break;
                    }
                }
                this._setPromies = this._setPromies.then(() => {
                    return new Promise((cb) => {
                        if (!fun) {
                            Data.storage.set(THIS._prepareForStorage(key), () => {
                                cb();
                                result(THIS);
                            });
                        } else {
                            THIS.get(THIS._nullObject(key)).then((items) => {
                                let set = {};
                                for (var k in key) {
                                    if (typeof key[k] === 'function') {
                                        set[k] = key[k](items[k]);
                                    } else {
                                        set[k] = key[k];
                                    }
                                }
                                Data.storage.set(THIS._prepareForStorage(set), () => {
                                    cb();
                                    result(THIS);
                                });
                            });
                        }
                    });
                });
            });
        }

        /**
         * Creates copy of object with all attributes set tu null
         * @param obj
         * @return {object}
         * @private
         */
        _nullObject(obj) {
            let newObj = {};
            for (var k in obj) {
                newObj[k] = null;
            }
            return newObj;
        }

        /**
         * Add timestamp to all values in provided data and update their key to database key
         * @param {object} data
         * @return {object}
         * @private
         */
        _prepareForStorage(data) {
            let newData = {};
            for (let k in data) {
                newData[this._getStorageKey(k)] = {
                    val: data[k],
                    timestamp: this._timestamp()
                };
            }
            return newData;
        }

        _timestamp() {
            return Data.timestamp();
        }

        /**
         * Get value by key or multiple values specified by object|array
         * @param {string|array|object} key String key, array of keys or object with specified default values
         * @returns {Promise.<Object>} value or object with values
         */
        get(key) {
            return this.getTimed(key).then((items) => {
                if (typeof key === 'object') {
                    var r = {};
                    for (var k in items) {
                        if (items[k]) {
                            r[k] = items[k].hasOwnProperty("val") ? items[k]["val"] : items[k];
                        }
                    }
                    return r;
                }
                if (items) {
                    return items.hasOwnProperty("val") ? items["val"] : items;
                }
                return null;
            });
        }

        /**
         * Get value by key or multiple values specified by object|array
         * @param {string|array|object} key String key, array of keys or object with specified default values
         * @returns {Promise.<Object>} Object with values and timestamps of last edit
         */
        getTimed(key) {
            let THIS = this;
            let old = key;
            if (Array.isArray(key)) {
                key = {};
                for (let k in old) {
                    key[old[k]] = null;
                }
            } else if (typeof key !== 'object') {
                key = {};
                key[old] = null;
            }
            let get = {};
            for (let k in key) {
                get[THIS._getStorageKey(k)] = key[k];
            }
            return new Promise(function (cb) {
                Data.storage.get(get, function (items) {
                    if (typeof old !== 'object' && old !== null) {
                        cb(items[THIS._getStorageKey(old)]);
                    } else {
                        let newItems = {};
                        for (let k in items) {
                            newItems[THIS._getKeyFromStorage(k)] = items[k];
                        }
                        cb(newItems);
                    }
                });
            });
        }

        delete() {
            var THIS = this;
            return new Promise((cb) => {
                let attrs = THIS.constructor.attributes();
                let remove = [];
                for (let k in attrs) {
                    remove.push(THIS._getStorageKey(attrs[k]));
                }
                Data.storage.remove(remove, () => {
                    let set = {};
                    set[THIS.id] = 'deleted';
                    Data.storage.set(set, () => {
                        cb(true);
                    });
                })
            });
        }

        /**
         * Convert object key to key for database
         * @param key
         * @returns {string}
         * @private
         */
        _getStorageKey(key) {
            return this.id + "#" + key;
        }

        /**
         * Convert key from database to object key
         * @param key
         * @returns {string|XML|void|*}
         * @private
         */
        _getKeyFromStorage(key) {
            return key.replace(this.keyRegEx, "")
        }

        static arrayAdder(value) {
            return function (array) {
                if (array) {
                    array.push(value);
                    return array;
                } else {
                    return [value];
                }
            }
        }

        static arrayDeleter(value) {
            return function (array) {
                if (array) {
                    let index = array.indexOf(value);
                    if (index !== -1) {
                        array.splice(index, 1);
                    }
                    return array;
                } else {
                    return [];
                }
            }
        }
    };
});