define(function (require) {
var NAMESPACE = "Base";
    class Data {
        get storage() {
            return chrome.storage.local;
        }

        timestamp() {
            return Date.now().valueOf();
        }

        get(keys, callback) {
            this.storage.get(keys, callback);
        }

        set(items, callback) {
            this.storage.set(items, callback);
        }

        remove(keys, callback) {
            this.storage.remove(keys, callback);
        }
    }
    return new Data();
});