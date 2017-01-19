var NAMESPACE = "Base";
define(function (require) {
    class Data {
        get storage() {
            return chrome.storage.local;
        }

        timestamp() {
            return Date.now();
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