define(function (require) {
    var NAMESPACE = "Gumi";
    let Synchronized = require("Base/Synchronized");
    let Data = require("Base/Data");
    var forge = require("lib/forge.min");
    var Notifications = require("Base/Notifications");

    let GumiSync = new Synchronized("Gumi");

    let SYNC_UP = 123;
    let SYNC_DOWN = 321;
    let BACKUP = 964;
    let SYNC_SUCCESS_MSG = "Sync success";

    class Gumi {
        backup(callback) {
            this._syncToServer(callback, BACKUP);
        }

        syncToServer(callback) {
            this._syncToServer(callback, SYNC_UP);
        }

        _syncToServer(callback, code) {
            this._prepareData().then((r) => {
                let data = r[0], gumiData = r[1];
                this._sign(data).then((sign) => {
                    GumiSync.get("computerName").then((computerName) => {
                        this._serverRequest({
                            code: code,
                            name: computerName,
                            sign: sign,
                            data: data
                        }, function (success, response) {
							console.log(response);
                            if (success && response === SYNC_SUCCESS_MSG) {
                                GumiSync.set("syncDate", Date.now());
                                Notifications.notify(_("syncSuccess"), Notifications.Type.SUCCESS);
                            } else {
                                console.error(_("syncError"));
                            }
                            if (typeof callback === 'function')
                                callback(success && response === SYNC_SUCCESS_MSG);
                        });
                    });
                });
            });
        }

        syncFromServer(callback) {
            this._prepareData().then((r) => {
                let data = r[0], gumiData = r[1];
                this._sign("").then((sign) => {
                    GumiSync.get("computerName").then((computerName) => {
                        this._serverRequest({
                            code: SYNC_DOWN,
                            name: computerName,
                            sign: sign
                        }, (success, response) => {
                            try {
                                response = JSON.parse(response);
                            } catch (e) {
                                success = false;
                            }
                            if (success) {
                                this._checkSyncResponse(response).then((valid) => {
                                    try {
                                        response.data = JSON.parse(response.data);
                                    } catch (e) {
                                        success = false;
                                    }
                                    if (valid && success) {
                                        Data.clear(() => {
                                            Data.set(response.data, () => {
                                                Data.set(gumiData, () => {
                                                    GumiSync.set("syncDate", Date.now());
                                                    Notifications.notify(_("syncSuccess"), Notifications.Type.SUCCESS);
                                                    callback(true);
                                                });
                                            });
                                        });
                                    } else {
                                        console.error(_("syncError"));
                                        callback(false);
                                    }
                                });
                            } else {
                                console.error(_("syncError"));
                                callback(false);
                            }
                        });
                    });
                });
            });
        }

        _checkSyncResponse(response) {
            return GumiSync.get({
                publicKey: null,
                computerName: null
            }).then((values) => {
				return this._sign(response.data);
            }).then((sign) => {
				return sign === response.sign;
			});
        }

        _prepareData() {
            return new Promise((cb) => {
                Data.get(null, (data) => {
                    let gumi = {};
                    let keys = Object.keys(data);
                    for (let i of keys) {
                        if (i.match(/^Gumi#/) !== null) {
                            gumi[i] = data[i];
                            delete data[i];
                        }
                    }
                    cb([JSON.stringify(data), gumi]);
                })
            });
        }

        _signDate() {
            return Math.floor(Date.now() / 1000 / 60 / 60 / 24).toString();
        }

        _sign(data) {
            return GumiSync.get({
                publicKey: null,
                computerName: null
            }).then((values) => {
                let md = forge.md.sha256.create();
				md.update(this._signDate() + btoa(encodeURIComponent(values.computerName)) + values.publicKey.replace(/\r|\n/g, "") + btoa(encodeURIComponent(data)));
                return md.digest().toHex();
            });
        }

        _serverRequest(data, cb) {
            GumiSync.get("serverUrl").then((serverUrl) => {
                if (!serverUrl) {
                    console.error(_("serverUrlNotSet"));
                    cb(false);
                    return;
                }

                let request = new XMLHttpRequest();

                request.open('POST', serverUrl, true);
                request.responseType = 'text';
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                request.onload = () => {
                    cb(true, request.response);
                };
                request.onerror = () => {
                    cb(false);
                };

                let paramsQuery = 'data=' + encodeURIComponent(JSON.stringify(data));
                request.send(paramsQuery);
            });
        }
    }

    return new Gumi();
});
