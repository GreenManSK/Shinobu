define(function (require) {
    var NAMESPACE = "Gumi";

    class Gumi {
        backup(callback) {
        }

        syncToServer(callback) {
            if (typeof callback === 'function')
                callback();
        }

        syncFromServer(callback) {
            if (typeof callback === 'function')
                callback();
        }
    }

    return new Gumi();
});
