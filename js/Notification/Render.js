var NAMESPACE = "Notification";
define(function (require) {
    let Synchronized = require("Base/Synchronized");
    let ITEM_TEMPLATE = "#template .item";
    let SEEN_CLASS = "seen";

    return class Render {
        constructor() {
            this.shinobu = new Synchronized("Shinobu");
        }

        render(selector) {
            let THIS = this;
            let $box = $(selector);
            this.shinobu.get({
                "notifications": []
            }).then((items) => {
                let notifications = items["notifications"];
                for (let i in notifications) {
                    $box.prepend(THIS._createNotification(notifications[i]));
                }
                chrome.runtime.sendMessage({name: "extensionNotifications.seeAll"}, null);
            });
        }

        _createNotification(notification) {
            if (!this.itemTemplate) {
                this.itemTemplate = $(ITEM_TEMPLATE);
            }
            var $item = this.itemTemplate.clone();
            if (notification.seen) {
                $item.addClass(SEEN_CLASS);
            }
            if (notification.link) {
                $item.find("a").attr("href", notification.link);
            }
            if (notification.img) {
                $item.find(".icon").append($("<img src='" + notification.icon + "' />"));
            } else {
                $item.find(".icon").append($('<i class="fa fa-' + notification.icon + '" aria-hidden="true"></i>'));
            }
            $item.find("h2").text(notification.text);
            return $item;
        }
    }
});