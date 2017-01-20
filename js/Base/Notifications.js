var NAMESPACE = "Base";
define(function (require) {
    var Data = require("Base/Data");
    var ID = 'notifications';
    var DATA_REPEAT = "data-repeat";
    var DATA_END = "data-end";

    class Notifications {
        static get Type() {
            return {
                ERROR: "error",
                SUCCESS: "success",
                WARNING: "warning"
            };
        }

        static get Voice() {
            return {
                KIRINO: "kirino",
                SHINOBU: "shinobu"
            }
        }

        constructor() {
            this.fadeInterval = 4000;
            var THIS = this;
            Data.get("notificationFadeTime", (items) => {
                if (items.fadeInterval)
                    THIS.fadeInterval = items.fadeInterval;
            });
        }

        start() {
            var THIS = this;
            this.$notifications = $('<div></div>').attr('id', ID);
            $('body').prepend(this.$notifications);
            this.$notifications.on("contextmenu", ".notification", function (e) {
                e.preventDefault();
                clearInterval($(this).attr(DATA_END));
            });
            this.$notifications.on("click", ".notification", function (e) {
                e.preventDefault();
                THIS._closingFunction($(this))();
            });

            let oldError = console.error;
            let oldWarn = console.warn;
            console.error = function (msg) {
                THIS.notify(msg, Notifications.Type.ERROR, THIS.fadeInterval * 3);
                oldError.apply(null, arguments)
            }
            console.warn = function (msg) {
                THIS.notify(msg, Notifications.Type.WARNING);
                oldWarn.apply(null, arguments)
            }

            chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
                if (request.name && request.name === 'notification') {
                    THIS.notify(request.msg, request.type, request.timeout);
                }
            });
        }

        notify(msg, type, timeout) {
            if (!timeout)
                timeout = this.fadeInterval;
            let $notify;
            let $same = this.$notifications.find('.notification:not(.noauto):contains("' + msg + '")');
            if ($same.length > 0) {
                clearTimeout($same.attr(DATA_END));
                let repeats = $same.attr(DATA_REPEAT);
                repeats = repeats ? parseInt(repeats) + 1 : 2;
                $same.attr(DATA_REPEAT, repeats);
                $notify = $same;
            } else {
                $notify = this._createNotification(msg, type);
                this._insertNotification($notify);
            }
            $notify.attr(DATA_END, setTimeout(this._closingFunction($notify), timeout));
        }

        _closingFunction($notify) {
            return function () {
                $notify.fadeOut(400, function () {
                    $notify.remove();
                });
            };
        }

        _createNotification(msg, type) {
            let $notify = $('<div class="notification"></div>');
            $notify.hide();
            if (type)
                $notify.addClass(type);
            $notify.html(msg);
            return $notify;
        }

        _insertNotification($notify) {
            this.$notifications.append($notify);
            $notify.fadeIn();
        }
    }
    return new Notifications();
})
;