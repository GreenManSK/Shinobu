define(function (require) {
    var NAMESPACE = "Background/Loops";
    let DEFAULT_ICON = "icons/kirino/128.png";

    return class ALoop {
        static get TODAY() {
            let d = new Date();
            d.setHours(23);
            d.setMinutes(59);
            d.setSeconds(59);
            d.setMilliseconds(59);
            return d.getTime();
        }

        constructor() {

        }

        start() {
            console.error(this.constructor.name + " loop need to implement start() method.");
        }

        _notify(text, link = "kirino.html", icon = null) {
            chrome.runtime.sendMessage({
                name: "extensionNotifications.add",
                "text": text,
                "img": icon === null,
                "icon": icon !== null ? icon : DEFAULT_ICON,
                "link": link
            }, null);
        }

        _timeToMs(time) {
            let parts = time.split(":");
            return 1000 * (parseInt(parts[1] + 60 * parseInt(parts[0])));
        }
    };
});