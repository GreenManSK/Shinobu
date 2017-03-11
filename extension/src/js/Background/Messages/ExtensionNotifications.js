define(function (require) {
    var NAMESPACE = "Background/Messages";
    let dispatcher = require("Background/Messages/Dispatcher");
    let Synchronized = require("Base/Synchronized");

    let DEFAULT_ICON = "icons/shinobu/128.png";

    class ExtensionNotifications {
        constructor() {
            this.shinobu = new Synchronized("Shinobu");
            this.promise = this._loadSettings();
        }

        _loadSettings() {
            let THIS = this;
            return new Promise((cb) => {
                (new Synchronized("Shinobu")).get({
                    "maxNotificationNumber": 20,
                    "notificationColor": "#3385AD"
                }).then((data) => {
                    THIS.max = data["maxNotificationNumber"];
                    THIS.color = data["notificationColor"];
                    cb();
                })
            });
        }

        onMessage(message, sender, sendResponse) {
            switch (message.name) {
                case "add":
                    this.add(message);
                    break;
                case "reload":
                    this.reload();
                    break;
                case "seeAll":
                    this.seeAll();
                    break;
            }
        }

        add(message) {
            let notification = {
                seen: false,
                text: message.text
            };
            if (message.link)
                notification.link = message.link;
            if (message.icon) {
                notification.icon = message.icon;
                if (message.img)
                    notification.img = true;
            } else {
                notification.img = true;
                notification.icon = DEFAULT_ICON;
            }
            this._chromeNotification(notification);
            let THIS = this;
            this.promise = this.promise.then(() => {
                return THIS.shinobu.set({
                    "notifications": Synchronized.arrayAdder(notification)
                });
            }).then(() => {
                THIS.checkMax();
                return true;
            });
        }

        _chromeNotification(notification) {
            chrome.notifications.create(null, {
                type: "basic",
                iconUrl: notification.img ? notification.icon : DEFAULT_ICON,
                "title": _("shinobu"),
                "message": notification.text
            }, function (id) {
                chrome.notifications.onClicked.addListener(function (clickedId) {
                    if (id === clickedId) {
                        if (notification.link) {
                            var win = window.open(notification.link, '_blank');
                            win.focus();
                        }
                        chrome.notifications.clear(id);
                    }
                });
            });
        }

        seeAll() {
            let THIS = this;
            this.promise = this.promise.then(() => {
                return THIS.shinobu.get({
                    "notifications": []
                });
            }).then((get) => {
                let notifications = get["notifications"];
                for (let i in notifications) {
                    notifications[i].seen = true;
                }
                THIS.shinobu.set({
                    "notifications": notifications
                }).then(() => {
                    THIS.reload();
                    return true;
                });
            });
        }

        checkMax() {
            let THIS = this;
            this.promise.then(() => {
                return THIS.shinobu.get({
                    "notifications": []
                });
            }).then((get) => {
                let notifications = get["notifications"];
                if (notifications.length > THIS.max) {
                    notifications.splice(0, notifications.length - THIS.max)
                    THIS.shinobu.set({
                        "notifications": notifications
                    }).then(() => {
                        THIS.reload();
                    });
                } else {
                    THIS.reload();
                }
            });
        }

        reload() {
            let THIS = this;
            this.promise = this._loadSettings();
            this.promise.then(() => {
                return THIS.shinobu.get({
                    "notifications": []
                });
            }).then((get) => {
                let notifications = get["notifications"];
                let unseen = 0;
                for (let i in notifications) {
                    if (!notifications[i].seen) {
                        unseen += 1;
                    }
                }
                dispatcher._dispatchMessage({name: "badge.text", text: "" + (unseen ? unseen : "")});
                dispatcher._dispatchMessage({name: "badge.color", color: THIS.color});
            });
        }
    }

    dispatcher.addListener("extensionNotifications", new ExtensionNotifications());
});