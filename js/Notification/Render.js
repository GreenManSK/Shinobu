define(function (require) {
    var NAMESPACE = "Notification";

    let Synchronized = require("Base/Synchronized");
    var BasicRender = require("Kirino/Render/BasicRender");
    let Linker = require("Form/Linker");
    let ITEM_TEMPLATE = "#template .item";
    let SEEN_CLASS = "seen";

    return class Render {
        constructor() {
            this.shinobu = new Synchronized("Shinobu");
            this.parsers = [];
        }

        addParser(parser) {
            this.parsers.push(parser);
        }

        renderAdd(selector) {
            let THIS = this;
            let $box = $(selector);
            chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
                let url = tabs[0].url;
                for (let i in THIS.parsers) {
                    if (THIS.parsers[i].doesUrlMatch(url)) {
                        let id = THIS.parsers[i].getIdFromUrl(url);
                        THIS.parsers[i].getData(id).then((data) => {
                            let link = Linker.createLink(THIS.parsers[i].getForm(), null, data);
                            let $add = $("<a href='" + link + "'><i class='fa fa-plus' aria-hidden='true'></i> " + _("add") + "</a>");
                            $add.on('click', function (e) {
                                e.preventDefault();
                                BasicRender._popItUp(this.getAttribute("href"), _('add'));
                            });
                            $box.append($add);
                        });
                        break;
                    }
                }
            })
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
                $item.find("a").attr("href", notification.link).attr('target', '_blank');
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